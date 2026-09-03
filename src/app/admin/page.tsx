"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { Topbar } from "@/components/Topbar";
import { coupons, customers, products } from "@/data/seed";
import { createOrder, resetDemo, useOrders } from "@/lib/demo-store";
import { brl, shortDate } from "@/lib/format";

export default function Admin() {
  const orders = useOrders();
  const b2b = orders.filter((order) => order.channel === "B2B");
  const retail = orders.filter((order) => order.channel === "RETAIL");
  const revenue = retail.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + (order.total || 0), 0);

  function createB2bDemo() {
    createOrder({
      channel: "B2B",
      status: "WAITING_PRICING",
      customerId: "c1",
      customerName: "Empório Horizonte (demo)",
      document: "00.000.000/0000-00",
      paymentTerms: "Condição demonstrativa",
      customerNote: "Pedido fictício criado pelo painel de demonstração.",
      items: [
        { productId: "p1", name: "Café torrado 500 g", quantity: 12 },
        { productId: "p3", name: "Mel silvestre 250 g", quantity: 8 },
      ],
    });
  }

  return (
    <main className="page"><div className="shell"><Topbar mode="ADMIN" />
      <div className="hero"><div><div className="eyebrow">Administração da demo</div><h1 className="title title-small">Visão geral.</h1><p className="subtitle">Resumo dos dados fictícios e atalhos para testar os fluxos.</p></div><div className="row"><button className="btn secondary" onClick={createB2bDemo}>CRIAR PEDIDO B2B</button><button className="btn danger" onClick={resetDemo}>LIMPAR DEMO</button></div></div>
      <div className="grid"><div className="panel kpi"><div className="eyebrow">Produtos</div><strong>{products.length}</strong></div><div className="panel kpi"><div className="eyebrow">Clientes B2B</div><strong>{customers.length}</strong></div><div className="panel kpi"><div className="eyebrow">Pedidos demo</div><strong>{orders.length}</strong></div><div className="panel kpi"><div className="eyebrow">Varejo demo</div><strong>{brl(revenue)}</strong></div></div>
      <div className="grid" style={{ marginTop: 16 }}><section className="panel" style={{ gridColumn: "span 7" }}><div className="row-between"><h2 className="section-title">Cupons</h2><span className="badge">Dados fictícios</span></div><div className="stack">{coupons.map((coupon) => <div className="cart-line" key={coupon.code}><div><strong>{coupon.code}</strong><div className="muted small">{coupon.campaign} · mínimo {brl(coupon.minOrder)}</div></div><div style={{ textAlign: "right" }}><strong>{coupon.discountType === "PERCENT" ? `${coupon.discountValue}%` : brl(coupon.discountValue)}</strong><div className="muted small">{coupon.active ? "ativo" : "inativo"}</div></div></div>)}</div></section>
        <section className="panel" style={{ gridColumn: "span 5" }}><h2 className="section-title">Escopo da demonstração</h2><div className="notice">Catálogo, clientes e cupons são dados estáticos definidos no projeto.</div><div className="notice" style={{ marginTop: 10 }}>Pedidos e histórico ficam somente neste navegador.</div></section>
      </div>
      <section className="panel" style={{ marginTop: 16 }}><div className="row-between"><h2 className="section-title">Últimos pedidos</h2><span className="badge">{b2b.length} B2B · {retail.length} varejo</span></div>{!orders.length && <div className="notice">Nenhum pedido criado ainda.</div>}<div className="stack">{orders.slice(0, 8).map((order) => <div className="cart-line" key={order.id}><div><strong>#{order.number} · {order.customerName || "Varejo"}</strong><div className="muted small">{shortDate(order.createdAt)} · {order.channel}</div></div><StatusBadge status={order.status} /></div>)}</div></section>
    </div></main>
  );
}
