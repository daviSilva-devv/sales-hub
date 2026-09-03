import type { OrderStatus } from "./types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  WAITING_PRICING: ["PRICING", "CANCELLED"],
  PRICING: ["READY_FOR_BILLING", "WAITING_PRICING", "CANCELLED"],
  READY_FOR_BILLING: ["BILLING", "PRICING", "CANCELLED"],
  BILLING: ["INVOICED", "READY_FOR_BILLING", "CANCELLED"],
  INVOICED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return transitions[from].includes(to);
}

export function assertTransition(from: OrderStatus, to: OrderStatus) {
  if (!canTransition(from, to)) throw new Error(`Transição inválida: ${from} → ${to}`);
}
