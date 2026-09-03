"use client";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { transitionOrder, useOrders } from "@/lib/demo-store";
import { brl, timeOnly } from "@/lib/format";
import type { Order, OrderStatus } from "@/domain/types";

const columns: {status:OrderStatus;title:string;action?:{label:string;to:OrderStatus}}[] = [
  {status:"CREATED",title:"Novos",action:{label:"ACEITAR PEDIDO",to:"PREPARING"}},
  {status:"PREPARING",title:"Preparando",action:{label:"MARCAR PRONTO",to:"READY"}},
  {status:"READY",title:"Prontos",action:{label:"ENTREGUE",to:"DELIVERED"}},
];

function RetailOrderCard({order,action}:{order:Order;action?:{label:string;to:OrderStatus}}){
  const total=order.total ?? order.items.reduce((sum,item)=>sum+(item.unitPrice||0)*item.quantity,0);
  return <div className="order-card"><div className="order-head"><div><div className="eyebrow">{timeOnly(order.createdAt)}</div><h2>#{order.number}</h2></div><StatusBadge status={order.status}/></div><ul className="order-items">{order.items.map((item)=><li key={item.productId}><span>{item.quantity}× {item.name}</span><strong>{brl((item.unitPrice||0)*item.quantity)}</strong></li>)}</ul>{order.couponCode&&<div className="notice success-note" style={{marginTop:12}}>Cupom aplicado: <strong>{order.couponCode}</strong></div>}<div className="total"><span>Total</span><span>{brl(total)}</span></div>{action&&<button className="btn full" onClick={()=>transitionOrder(order.id,action.to,"OPERACAO_VAREJO")}>{action.label}</button>}</div>;
}

export default function RetailOps(){
  const orders=useOrders().filter((order)=>order.channel==="RETAIL"&&order.status!=="CANCELLED");
  const active=orders.filter((order)=>["CREATED","PREPARING","READY"].includes(order.status));
  const delivered=orders.filter((order)=>order.status==="DELIVERED");
  return <main className="page"><div className="shell"><Topbar mode="OPERAÇÃO VAREJO"/><div className="hero"><div><div className="eyebrow">Painel da loja</div><h1 className="title title-small">Pedidos em tempo real.</h1><p className="subtitle">O pedido criado no totem aparece aqui sem atualizar a página.</p></div><div className="panel panel-soft"><div className="eyebrow">Na operação</div><strong style={{fontSize:34}}>{active.length}</strong></div></div>
    <div className="order-columns">{columns.map((column)=>{const list=orders.filter((order)=>order.status===column.status);return <section className="order-column" key={column.status}><div className="column-head"><h3>{column.title}</h3><span className="count-pill">{list.length}</span></div><div className="stack">{!list.length&&<div className="notice">Nenhum pedido aqui.</div>}{list.map((order)=><RetailOrderCard key={order.id} order={order} action={column.action}/>)}</div></section>})}</div>
    {!!delivered.length&&<div style={{marginTop:22}}><div className="eyebrow">Entregues recentemente</div><div className="grid" style={{marginTop:10}}>{delivered.slice(0,6).map((order)=><div className="panel" style={{gridColumn:"span 4"}} key={order.id}><div className="row-between"><strong>#{order.number}</strong><StatusBadge status={order.status}/></div><div className="muted small" style={{marginTop:8}}>{order.items.length} item(ns) · {timeOnly(order.createdAt)}</div></div>)}</div></div>}
  </div></main>;
}
