export type UserRole = 'customer' | 'staff' | 'manager' | 'admin';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'closed'
  | 'cancelled'
  | 'refunded'
  | 'payment_failed';

export type FulfillmentType = 'delivery' | 'pickup';
export type PaymentMethod = 'razorpay' | 'cod';
export type PreferredLanguage = 'en' | 'bn';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  error: null;
  meta: Record<string, unknown>;
}

export interface ApiErrorBody {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  preferredLanguage?: PreferredLanguage;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  minQty: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  availableQty?: number | null;
}

export const ORDER_STATUSES: OrderStatus[] = [
  'placed',
  'confirmed',
  'in_progress',
  'completed',
  'closed',
  'cancelled',
  'refunded',
  'payment_failed',
];
