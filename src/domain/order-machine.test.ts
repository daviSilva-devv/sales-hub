import { describe, expect, it } from "vitest";
import { canTransition } from "./order-machine";

describe("order state machine", () => {
  it("allows CREATED to PREPARING", () => expect(canTransition("CREATED", "PREPARING")).toBe(true));
  it("rejects CREATED to DELIVERED", () => expect(canTransition("CREATED", "DELIVERED")).toBe(false));
  it("allows PREPARING to READY", () => expect(canTransition("PREPARING", "READY")).toBe(true));
  it("keeps INVOICED terminal", () => expect(canTransition("INVOICED", "BILLING")).toBe(false));
  it("keeps CANCELLED terminal", () => expect(canTransition("CANCELLED", "CREATED")).toBe(false));
  it("allows WAITING_PRICING to PRICING", () => expect(canTransition("WAITING_PRICING", "PRICING")).toBe(true));
  it("allows PRICING to READY_FOR_BILLING", () => expect(canTransition("PRICING", "READY_FOR_BILLING")).toBe(true));
});
