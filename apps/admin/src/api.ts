const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api/v1';

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

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentType: string;
  paymentMethod: string;
  total: number;
  placedAt: string;
  customerName: string;
  customerPhone: string;
};

export type AdminOrderDetail = AdminOrder & {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  addressLine1?: string | null;
  items: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    qty: number;
    lineTotal: number;
  }>;
  timeline: Array<{ status: string; at: string; note?: string }>;
};

export type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  price: number;
  minQty: number;
  imageUrl?: string | null;
  isActive: boolean;
  availableQty: number;
  isAvailable: boolean;
};

export type AdminCategory = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type ProductWrite = {
  sku?: string;
  name?: string;
  description?: string;
  categoryId?: string | null;
  price?: number;
  minQty?: number;
  imageUrl?: string | null;
  isActive?: boolean;
  branchId?: string;
  availableQty?: number;
  isAvailable?: boolean;
};

export type Dashboard = {
  ordersToday: number;
  pending: number;
  inKitchen: number;
  completedToday: number;
  codTotalToday: number;
  autoConfirm: {
    startHour: number;
    endHour: number;
    currentlyAutoConfirm: boolean;
    serverHour: number;
  };
};

export type AdminUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
};

export type Coupon = {
  id: string;
  code: string;
  description?: string | null;
  discountValue: number;
  minItems: number;
  minSubtotal: number;
  isActive: boolean;
};

export type Banner = {
  id: string;
  title: string;
  body?: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type CodDayReport = {
  day: string;
  orderCount: number;
  collected: number;
  outstanding: number;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    customerName: string;
    customerPhone: string;
  }>;
};

export const api = {
  base: API_BASE,
  requestOtp: (phone: string) =>
    request<{ sent: boolean; message: string }>('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, otp: string) =>
    request<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; name: string; phone: string; role: string };
    }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),
  listOrders: (token: string, branchId?: string) => {
    const q = branchId ? `?branchId=${branchId}` : '';
    return request<AdminOrder[]>(`/admin/orders${q}`, { token });
  },
  getOrder: (token: string, orderId: string) =>
    request<AdminOrderDetail>(`/admin/orders/${orderId}`, { token }),
  updateStatus: (token: string, orderId: string, status: string) =>
    request<{ updated: boolean; status: string }>(`/admin/orders/${orderId}/status`, {
      method: 'POST',
      token,
      body: JSON.stringify({ status }),
    }),
  listProducts: (token: string, branchId?: string) => {
    const q = branchId ? `?branchId=${branchId}` : '';
    return request<AdminProduct[]>(`/admin/products${q}`, { token });
  },
  createProduct: (token: string, payload: ProductWrite) =>
    request<AdminProduct>('/admin/products', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  updateProduct: (token: string, productId: string, payload: ProductWrite) =>
    request<AdminProduct>(`/admin/products/${productId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    }),
  listCategories: (token: string) =>
    request<AdminCategory[]>('/admin/categories', { token }),
  createCategory: (token: string, payload: { name: string; sortOrder?: number }) =>
    request<AdminCategory>('/admin/categories', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  dashboard: (token: string, branchId?: string) => {
    const q = branchId ? `?branchId=${branchId}` : '';
    return request<Dashboard>(`/admin/dashboard${q}`, { token });
  },
  listUsers: (token: string) => request<AdminUser[]>('/admin/users', { token }),
  setUserRole: (token: string, userId: string, role: string) =>
    request<AdminUser>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ role }),
    }),
  codDay: (token: string, branchId?: string) => {
    const q = branchId ? `?branchId=${branchId}` : '';
    return request<CodDayReport>(`/admin/reports/cod-day${q}`, { token });
  },
  listCoupons: (token: string) => request<Coupon[]>('/admin/coupons', { token }),
  createCoupon: (
    token: string,
    payload: {
      code: string;
      discountValue: number;
      minItems?: number;
      description?: string;
    },
  ) =>
    request<Coupon>('/admin/coupons', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  patchCoupon: (token: string, id: string, payload: Partial<Coupon>) =>
    request<Coupon>(`/admin/coupons/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    }),
  listBanners: (token: string) => request<Banner[]>('/admin/banners', { token }),
  createBanner: (token: string, payload: { title: string; body?: string }) =>
    request<Banner>('/admin/banners', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),
  patchBanner: (token: string, id: string, payload: Partial<Banner>) =>
    request<Banner>(`/admin/banners/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    }),
  health: () => request<{ status: string; db: string; version?: string }>('/health'),
};
