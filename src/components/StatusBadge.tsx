import type { OrderStatus } from "@/domain/types";

const labels: Record<OrderStatus, string> = {
  CREATED: "Novo",
  PREPARING: "Preparando",
  READY: "Pronto",
  DELIVERED: "Entregue",
  WAITING_PRICING: "Aguardando preço",
  PRICING: "Em precificação",
  READY_FOR_BILLING: "Liberado",
  BILLING: "Faturando",
  INVOICED: "Faturado",
  CANCELLED: "Cancelado",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{labels[status]}</span>;
}
