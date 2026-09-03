import { describe, expect, it } from "vitest";
import type { Coupon, Product } from "@/domain/types";
import { couponDiscount, effectiveRetailPrice, normalizeCouponCode } from "./pricing";

const product: Product = { id: "p1", sku: "DEMO", name: "Produto", shortName: "Produto", category: "Demo", retailPrice: 20, unit: "unidade", active: true, accent: "#000000" };
const coupon: Coupon = { code: "TESTE10", label: "Teste", discountType: "PERCENT", discountValue: 10, minOrder: 50, campaign: "Demo", active: true };

describe("pricing", () => {
  it("uses the promotional price when present", () => expect(effectiveRetailPrice({ ...product, promoPrice: 17 })).toBe(17));
  it("uses the regular price without a promotion", () => expect(effectiveRetailPrice(product)).toBe(20));
  it("calculates a percentage discount", () => expect(couponDiscount(100, coupon)).toBe(10));
  it("calculates a fixed discount", () => expect(couponDiscount(100, { ...coupon, discountType: "FIXED", discountValue: 12 })).toBe(12));
  it("rejects an order below the minimum", () => expect(couponDiscount(49.99, coupon)).toBe(0));
  it("rejects an inactive coupon", () => expect(couponDiscount(100, { ...coupon, active: false })).toBe(0));
  it("never discounts more than the subtotal", () => expect(couponDiscount(30, { ...coupon, minOrder: 0, discountType: "FIXED", discountValue: 50 })).toBe(30));
  it("normalizes a coupon code", () => expect(normalizeCouponCode("  teste 10 ")).toBe("TESTE10"));
});
