import type { ApiSuccess } from '@efood/shared';

export function ok<T>(data: T, meta: Record<string, unknown> = {}): ApiSuccess<T> {
  return {
    success: true,
    data,
    error: null,
    meta,
  };
}

export function fail(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
) {
  return {
    status,
    body: {
      success: false as const,
      data: null,
      error: { code, message, details },
      meta: {} as Record<string, unknown>,
    },
  };
}
