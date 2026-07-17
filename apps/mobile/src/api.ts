// Device/APK default: Mac LAN IP (same Wi‑Fi). Override with EXPO_PUBLIC_API_BASE at build time.
// Emulator: http://10.0.2.2:4000/api/v1 · Simulator/web: http://localhost:4000/api/v1
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ?? 'http://192.168.29.168:4000/api/v1';

export type Product = {
  id: string;
  name: string;
  price: number;
  minQty: number;
  isAvailable: boolean;
  availableQty?: number | null;
  description?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  sku?: string;
};

export type Category = {
  id: string;
  name: string;
  sortOrder: number;
};

export type Cart = {
  branchId: string;
  items: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    qty: number;
    lineTotal: number;
    minQty: number;
  }>;
  subtotal: number;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  placedAt: string;
  itemCount: number;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentType: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    qty: number;
    lineTotal: number;
  }>;
  timeline: Array<{ status: string; at: string }>;
  placedAt: string;
  canCancel: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: string;
  preferredLanguage?: string;
};

export type Address = {
  id: string;
  line1: string;
  landmark?: string | null;
  pincode?: string | null;
  isDefault: boolean;
};

export type Banner = {
  id: string;
  title: string;
  body: string;
  sortOrder: number;
};

export type CouponValidation = {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minItems: number;
  minSubtotal: number;
  discount: number;
  applicable: boolean;
};

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.token) headers.set('Authorization', `Bearer ${options.token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body?.error?.message || `Request failed (${res.status})`);
  }
  return body.data as T;
}

export const BRANCH_ID = '00000000-0000-4000-8000-000000000010';

export const api = {
  base: API_BASE,
  listCategories: () => request<Category[]>('/categories'),
  listProducts: (categoryId?: string | null, q?: string) => {
    const params = new URLSearchParams({ branchId: BRANCH_ID });
    if (categoryId) params.set('categoryId', categoryId);
    if (q?.trim()) params.set('q', q.trim());
    return request<Product[]>(`/products?${params.toString()}`);
  },
  getProduct: (productId: string) =>
    request<Product>(`/products/${productId}?branchId=${BRANCH_ID}`),
  requestOtp: (phone: string) =>
    request<{ sent: boolean; message: string }>('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, otp: string) =>
    request<{
      accessToken: string;
      user: { id: string; name: string; phone: string };
    }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),
  putCart: (token: string, items: Array<{ productId: string; qty: number }>) =>
    request<Cart>(`/cart?branchId=${BRANCH_ID}`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ items }),
    }),
  createAddress: (
    token: string,
    payload: { line1: string; landmark?: string; pincode?: string },
  ) =>
    request<Address>('/me/addresses', {
      method: 'POST',
      token,
      body: JSON.stringify({ ...payload, isDefault: true }),
    }),
  listAddresses: (token: string) => request<Address[]>('/me/addresses', { token }),
  getMe: (token: string) => request<UserProfile>('/me', { token }),
  updateMe: (token: string, payload: { name?: string; preferredLanguage?: string }) =>
    request<UserProfile>('/me', {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    }),
  listOrders: (token: string) => request<OrderSummary[]>('/orders', { token }),
  getOrder: (token: string, orderId: string) =>
    request<OrderDetail>(`/orders/${orderId}`, { token }),
  cancelOrder: (token: string, orderId: string) =>
    request<{ cancelled: boolean }>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      token,
      body: JSON.stringify({ reason: 'Changed mind' }),
    }),
  placeOrder: (
    token: string,
    payload: {
      addressId?: string;
      items: Array<{ productId: string; qty: number }>;
      fulfillmentType?: 'delivery' | 'pickup';
      couponCode?: string;
    },
  ) => {
    const fulfillmentType = payload.fulfillmentType ?? 'delivery';
    const body: Record<string, unknown> = {
      branchId: BRANCH_ID,
      fulfillmentType,
      paymentMethod: 'cod',
      items: payload.items,
    };
    if (fulfillmentType === 'delivery' && payload.addressId) {
      body.addressId = payload.addressId;
    }
    if (payload.couponCode?.trim()) {
      body.couponCode = payload.couponCode.trim();
    }
    return request<{
      id: string;
      orderNumber: string;
      status: string;
      total: number;
    }>('/orders', {
      method: 'POST',
      token,
      headers: {
        'Idempotency-Key': `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      },
      body: JSON.stringify(body),
    });
  },
  listBanners: () => request<Banner[]>('/banners'),
  validateCoupon: (
    token: string,
    payload: { code: string; itemCount: number; subtotal: number },
  ) =>
    request<CouponValidation>('/coupons/validate', {
      method: 'POST',
      token,
      body: JSON.stringify({
        code: payload.code,
        itemCount: payload.itemCount,
        subtotal: payload.subtotal,
      }),
    }),
  registerDeviceToken: (
    token: string,
    payload: { token: string; platform: string },
  ) =>
    request<{ registered: boolean }>('/me/device-tokens', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
};
