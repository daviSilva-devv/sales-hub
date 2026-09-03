export type OrderChannel = "RETAIL" | "B2B";
export type OrderStatus =
  | "CREATED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "WAITING_PRICING"
  | "PRICING"
  | "READY_FOR_BILLING"
  | "BILLING"
  | "INVOICED"
  | "CANCELLED";

export type Product = {
  id: string;
  sku: string;
  name: string;
  shortName: string;
  category: string;
  retailPrice: number;
  promoPrice?: number;
  unit: string;
  active: boolean;
  featured?: boolean;
  accent: string;
};

export type Customer = {
  id: string;
  document: string;
  name: string;
  salesRep: string;
  paymentTerms: string;
  phone?: string;
};

export type Coupon = {
  code: string;
  label: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrder: number;
  campaign: string;
  active: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  lotNote?: string;
};

export type OrderEvent = {
  at: string;
  type: string;
  actor: string;
  note?: string;
};

export type Order = {
  id: string;
  number: number;
  channel: OrderChannel;
  status: OrderStatus;
  createdAt: string;
  customerId?: string;
  customerName?: string;
  document?: string;
  items: OrderItem[];
  customerNote?: string;
  commercialNote?: string;
  paymentTerms?: string;
  couponCode?: string;
  subtotal?: number;
  discount?: number;
  total?: number;
  events: OrderEvent[];
};
