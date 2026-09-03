import type { Coupon, Product } from "@/domain/types";

export function effectiveRetailPrice(product: Product) {
  return product.promoPrice ?? product.retailPrice;
}

export function couponDiscount(subtotal: number, coupon?: Coupon | null) {
  if (!coupon || !coupon.active || subtotal < coupon.minOrder) return 0;
  if (coupon.discountType === "PERCENT") return Math.min(subtotal, subtotal * (coupon.discountValue / 100));
  return Math.min(subtotal, coupon.discountValue);
}

export function normalizeCouponCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
