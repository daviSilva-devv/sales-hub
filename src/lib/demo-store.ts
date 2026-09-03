"use client";

import { useSyncExternalStore } from "react";
import type { Order, OrderStatus } from "@/domain/types";
import { assertTransition } from "@/domain/order-machine";

const STORAGE_KEY = "sales_hub_demo_orders_v1";
const CHANNEL_NAME = "sales_hub_demo_orders";
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;
let storageBound = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function ensureRealtime() {
  if (typeof window === "undefined") return;
  if (!storageBound) {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) emit();
    });
    storageBound = true;
  }
  if (channel || typeof BroadcastChannel === "undefined") return;
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = () => emit();
}

let cachedRaw = "__unset__";
let cachedOrders: Order[] = [];
const serverSnapshot: Order[] = [];

function readOrders(): Order[] {
  if (typeof window === "undefined") return serverSnapshot;
  ensureRealtime();
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  if (raw === cachedRaw) return cachedOrders;
  cachedRaw = raw;
  try {
    cachedOrders = JSON.parse(raw) as Order[];
  } catch {
    cachedOrders = [];
  }
  return cachedOrders;
}

function writeOrders(orders: Order[]) {
  const raw = JSON.stringify(orders);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedOrders = orders;
  channel?.postMessage({ type: "orders.changed" });
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  ensureRealtime();
  return () => listeners.delete(listener);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, readOrders, () => serverSnapshot);
}

export function createOrder(input: Omit<Order, "id" | "number" | "createdAt" | "events">) {
  const orders = readOrders();
  const now = new Date().toISOString();
  const number = Math.max(1000, ...orders.map((order) => order.number)) + 1;
  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    number,
    createdAt: now,
    events: [{ at: now, type: "ORDER_CREATED", actor: input.channel === "B2B" ? "TOTEM_CLIENTE" : "TOTEM_VAREJO" }],
  };
  writeOrders([order, ...orders]);
  return order;
}

export function transitionOrder(id: string, to: OrderStatus, actor: string, note?: string) {
  const orders = readOrders();
  const updated = orders.map((order) => {
    if (order.id !== id) return order;
    assertTransition(order.status, to);
    return { ...order, status: to, events: [...order.events, { at: new Date().toISOString(), type: `STATUS_${to}`, actor, note }] };
  });
  writeOrders(updated);
}

export function patchOrder(id: string, patch: Partial<Order>, actor: string, eventType = "ORDER_UPDATED") {
  const orders = readOrders();
  const updated = orders.map((order) => order.id === id ? { ...order, ...patch, events: [...order.events, { at: new Date().toISOString(), type: eventType, actor }] } : order);
  writeOrders(updated);
}

export function resetDemo() {
  writeOrders([]);
}
