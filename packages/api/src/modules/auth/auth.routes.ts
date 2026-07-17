import { Router } from 'express';
import { pool } from '../../db/pool';
import {
  hashToken,
  requireAuth,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../middleware/auth';
import { sendOtpSms } from '../../utils/msg91';
import { fail, ok } from '../../utils/response';

export const authRouter = Router();

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

const OTP_MAX_PER_WINDOW = Number(process.env.OTP_MAX_PER_WINDOW ?? 5);
const OTP_WINDOW_MINUTES = Number(process.env.OTP_WINDOW_MINUTES ?? 15);

authRouter.post('/otp/request', async (req, res, next) => {
  try {
    const phone = normalizePhone(String(req.body?.phone ?? ''));
    if (phone.length < 10) {
      const err = fail('VALIDATION_ERROR', 'Valid phone is required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    const recent = await pool.query(
      `SELECT COUNT(*)::int AS c FROM otp_request_log
       WHERE phone = $1 AND requested_at > NOW() - ($2::int * INTERVAL '1 minute')`,
      [phone, OTP_WINDOW_MINUTES],
    );
    if (recent.rows[0].c >= OTP_MAX_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        data: null,
        error: {
          code: 'OTP_RATE_LIMIT',
          message: `Too many OTP requests. Try again in ${OTP_WINDOW_MINUTES} minutes.`,
        },
        meta: { requestId: res.locals.requestId },
      });
    }

    const stub = process.env.OTP_STUB !== 'false';
    const code = stub ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)`,
      [phone, code, expiresAt],
    );
    await pool.query(`INSERT INTO otp_request_log (phone) VALUES ($1)`, [phone]);

    const sms = await sendOtpSms(phone, code);

    return res.json(
      ok(
        {
          sent: sms.sent || stub,
          message: stub
            ? 'OTP stub mode — use code 123456'
            : 'OTP sent if phone is valid',
          provider: sms.provider,
        },
        { requestId: res.locals.requestId },
      ),
    );
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/otp/verify', async (req, res, next) => {
  try {
    const phone = normalizePhone(String(req.body?.phone ?? ''));
    const otp = String(req.body?.otp ?? '');
    if (!phone || !otp) {
      const err = fail('VALIDATION_ERROR', 'phone and otp are required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    const match = await pool.query(
      `SELECT id FROM otp_codes
       WHERE phone = $1 AND code = $2 AND consumed_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone, otp],
    );
    if (!match.rowCount) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP' },
        meta: { requestId: res.locals.requestId },
      });
    }

    await pool.query(`UPDATE otp_codes SET consumed_at = NOW() WHERE id = $1`, [
      match.rows[0].id,
    ]);

    const upsert = await pool.query(
      `INSERT INTO users (phone, name, role)
       VALUES ($1, 'Customer', 'customer')
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id, name, phone, role, preferred_language AS "preferredLanguage"`,
      [phone],
    );
    const userRow = upsert.rows[0];
    const authUser = {
      id: userRow.id,
      name: userRow.name,
      phone: userRow.phone,
      role: userRow.role,
    };

    const access = signAccessToken(authUser);
    const refresh = signRefreshToken(authUser.id);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [authUser.id, hashToken(refresh.token), refresh.expiresAt],
    );

    return res.json(
      ok(
        {
          accessToken: access.token,
          refreshToken: refresh.token,
          expiresIn: access.expiresIn,
          user: {
            id: userRow.id,
            name: userRow.name,
            phone: userRow.phone,
            role: userRow.role,
            preferredLanguage: userRow.preferredLanguage,
          },
        },
        { requestId: res.locals.requestId },
      ),
    );
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = String(req.body?.refreshToken ?? '');
    if (!refreshToken) {
      const err = fail('VALIDATION_ERROR', 'refreshToken is required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    let userId: string;
    try {
      userId = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' },
        meta: { requestId: res.locals.requestId },
      });
    }

    const stored = await pool.query(
      `SELECT id FROM refresh_tokens
       WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL AND expires_at > NOW()`,
      [userId, hashToken(refreshToken)],
    );
    if (!stored.rowCount) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Refresh token revoked or expired' },
        meta: { requestId: res.locals.requestId },
      });
    }

    await pool.query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1`, [
      stored.rows[0].id,
    ]);

    const userRes = await pool.query(
      `SELECT id, name, phone, role, preferred_language AS "preferredLanguage"
       FROM users WHERE id = $1`,
      [userId],
    );
    const userRow = userRes.rows[0];
    const authUser = {
      id: userRow.id,
      name: userRow.name,
      phone: userRow.phone,
      role: userRow.role,
    };
    const access = signAccessToken(authUser);
    const refresh = signRefreshToken(authUser.id);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [authUser.id, hashToken(refresh.token), refresh.expiresAt],
    );

    return res.json(
      ok(
        {
          accessToken: access.token,
          refreshToken: refresh.token,
          expiresIn: access.expiresIn,
          user: userRow,
        },
        { requestId: res.locals.requestId },
      ),
    );
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const refreshToken = String(req.body?.refreshToken ?? '');
    if (refreshToken) {
      await pool.query(
        `UPDATE refresh_tokens SET revoked_at = NOW()
         WHERE user_id = $1 AND token_hash = $2 AND revoked_at IS NULL`,
        [res.locals.user!.id, hashToken(refreshToken)],
      );
    }
    return res.json(ok({ loggedOut: true }, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

authRouter.post('/logout-all', requireAuth, async (_req, res, next) => {
  try {
    await pool.query(
      `UPDATE refresh_tokens SET revoked_at = NOW()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [res.locals.user!.id],
    );
    return res.json(ok({ loggedOutAll: true }, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});
