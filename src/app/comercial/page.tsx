"use client";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { patchOrder, transitionOrder, useOrders } from "@/lib/demo-store";
import { brl, parseMoney, shortDate } from "@/lib/format";
import type { Order } from "@/domain/types";

function PricingCard({order}:{order:Order}){
  const [prices,setPrices]=useState<Record<string,string>>(()=>Object.fromEntries(order.items.map((item)=>[item.productId,item.unitPrice ? item.unitPrice.toFixed(2).replace(".",",") : ""])));
  const [lot,setLot]=useState(order.commercialNote||"");
  const [saved,setSaved]=useState(false);
  const parsedPrices=useMemo(()=>Object.fromEntries(Object.entries(prices).map(([id,value])=>[id,parseMoney(value)])),[prices]);
  const total=order.items.reduce((sum,item)=>sum+(parsedPrices[item.productId]||0)*item.quantity,0);
  const complete=order.items.every((item)=>(parsedPrices[item.productId]||0)>0);

  function persist(){
    const items=order.items.map((item)=>({...item,unitPrice:parsedPrices[item.productId]||0,lotNote:lot}));
    patchOrder(order.id,{items,commercialNote:lot,total},"COMERCIAL","PRICING_SAVED");
    if(order.status==="WAITING_PRICING") transitionOrder(order.id,"PRICING","COMERCIAL","Pedido aberto para precificação");
    setSaved(true);
  }
  function release(){
    if(!complete) return;
    const items=order.items.map((item)=>({...item,unitPrice:parsedPrices[item.productId]||0,lotNote:lot}));
    patchOrder(order.id,{items,commercialNote:lot,total},"COMERCIAL","PRICING_CONFIRMED");
    if(order.status==="WAITING_PRICING") {
      transitionOrder(order.id,"PRICING","COMERCIAL","Precificação concluída");
      setTimeout(()=>transitionOrder(order.id,"READY_FOR_BILLING","COMERCIAL","Preço/lote conferidos"),0);
    } else transitionOrder(order.id,"READY_FOR_BILLING","COMERCIAL","Preço/lote conferidos");
  }
  return <div className="order-card"><div className="order-head"><div><div className="eyebrow">Pedido #{order.number} · {shortDate(order.createdAt)}</div><h2>{order.customerName}</h2><div className="muted">{order.document} · {order.paymentTerms}</div></div><StatusBadge status={order.status}/></div>
    {order.customerNote&&<div className="notice warning-note" style={{marginTop:14}}><strong>Cliente:</strong> {order.customerNote}</div>}
    <div className="hr"/>{order.items.map((item)=><div className="cart-line" key={item.productId}><div className="cart-product"><strong>{item.quantity}× {item.name}</strong><span>Valor negociado por caixa/unidade</span></div><div className="price-input-wrap"><span className="currency-label">R$</span><input className="field price-input" inputMode="decimal" placeholder="95,00" value={prices[item.productId]} onChange={(e)=>{setSaved(false);setPrices((current)=>({...current,[item.productId]:e.target.value}))}}/></div></div>)}
    <div style={{marginTop:14}}><label className="eyebrow" htmlFor={`lot-${order.id}`}>Lote, data e observação</label><textarea id={`lot-${order.id}`} className="field textarea" style={{marginTop:7}} value={lot} onChange={(e)=>{setSaved(false);setLot(e.target.value)}} placeholder="Ex.: lote L3 · produção 21/08 · separar manhã"/></div>
    <div className="total"><span>Total do pedido</span><span>{brl(total)}</span></div>{!complete&&<div className="notice warning-note" style={{marginBottom:12}}>Informe o preço de todos os itens antes de liberar.</div>}{saved&&<div className="coupon-success" style={{marginBottom:10}}>Alterações salvas.</div>}<div className="row"><button className="btn secondary" onClick={persist}>SALVAR RASCUNHO</button><button className="btn" disabled={!complete} onClick={release}>LIBERAR FATURAMENTO</button></div>
  </div>;
}

export default function Commercial(){
  const orders=useOrders().filter((order)=>order.channel==="B2B"&&["WAITING_PRICING","PRICING"].includes(order.status));
  return <main className="page"><div className="shell"><Topbar mode="COMERCIAL"/><div className="hero"><div><div className="eyebrow">Fila comercial B2B</div><h1 className="title title-small">Precificar e liberar.</h1><p className="subtitle">O cliente seleciona sem preço. Aqui o vendedor informa os valores negociados, lote/data e entrega o pedido pronto ao faturamento.</p></div><div className="panel panel-soft"><div className="eyebrow">Aguardando</div><strong style={{fontSize:34}}>{orders.length}</strong></div></div><div className="stack">{!orders.length&&<div className="notice">Nenhum pedido aguardando preço. Use o Totem Cliente para criar um pedido demo.</div>}{orders.map((order)=><PricingCard key={order.id} order={order}/>)}</div></div></main>;
}
