import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@efood/shared';

export type AuthUser = {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
};

const accessSecret = () => process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me';
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';

export function signAccessToken(user: AuthUser): { token: string; expiresIn: number } {
  const expiresIn = 900;
  const token = jwt.sign(
    { sub: user.id, phone: user.phone, role: user.role, name: user.name },
    accessSecret(),
    { expiresIn },
  );
  return { token, expiresIn };
}

export function signRefreshToken(userId: string): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = jwt.sign({ sub: userId, typ: 'refresh' }, refreshSecret(), {
    expiresIn: '7d',
  });
  return { token, expiresAt };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Missing bearer token' },
      meta: { requestId: res.locals.requestId },
    });
  }
  try {
    const payload = jwt.verify(header.slice(7), accessSecret()) as jwt.JwtPayload;
    res.locals.user = {
      id: String(payload.sub),
      phone: String(payload.phone),
      role: payload.role as UserRole,
      name: String(payload.name ?? 'Customer'),
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
      meta: { requestId: res.locals.requestId },
    });
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthUser | undefined;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Insufficient role' },
        meta: { requestId: res.locals.requestId },
      });
    }
    return next();
  };
}

export function verifyRefreshToken(token: string): string {
  const payload = jwt.verify(token, refreshSecret()) as jwt.JwtPayload;
  if (payload.typ !== 'refresh' || !payload.sub) {
    throw new Error('Invalid refresh token');
  }
  return String(payload.sub);
}
