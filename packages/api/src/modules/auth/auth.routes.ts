import { Router } from 'express';
import { fail, ok } from '../../utils/response';

/**
 * Auth stubs — wire MSG91 + JWT in Phase 2.
 * Contract matches docs/openapi.yaml
 */
export const authRouter = Router();

authRouter.post('/otp/request', (req, res) => {
  const phone = String(req.body?.phone ?? '');
  if (!phone || phone.length < 10) {
    const err = fail('VALIDATION_ERROR', 'Valid phone is required');
    return res.status(err.status).json({
      ...err.body,
      meta: { requestId: res.locals.requestId },
    });
  }
  return res.json(
    ok(
      { sent: true, message: 'OTP sent if phone is valid' },
      { requestId: res.locals.requestId },
    ),
  );
});

authRouter.post('/otp/verify', (req, res) => {
  const { phone, otp } = req.body ?? {};
  if (!phone || !otp) {
    const err = fail('VALIDATION_ERROR', 'phone and otp are required');
    return res.status(err.status).json({
      ...err.body,
      meta: { requestId: res.locals.requestId },
    });
  }
  // Stub tokens for scaffold / contract testing only
  return res.json(
    ok(
      {
        accessToken: 'stub-access-token',
        refreshToken: 'stub-refresh-token',
        expiresIn: 900,
        user: {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'Customer',
          phone: String(phone),
          role: 'customer',
          preferredLanguage: 'en',
        },
      },
      { requestId: res.locals.requestId },
    ),
  );
});
