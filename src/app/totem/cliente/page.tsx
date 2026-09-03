"use client";
import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { ProductVisual } from "@/components/ProductVisual";
import { categories, customers, products } from "@/data/seed";
import { createOrder } from "@/lib/demo-store";
import type { Customer } from "@/domain/types";

export default function ClientTotem(){
  const [doc,setDoc]=useState("");
  const [customer,setCustomer]=useState<Customer|null>(null);
  const [cart,setCart]=useState<Record<string,number>>({});
  const [note,setNote]=useState("");
  const [done,setDone]=useState<number|null>(null);
  const [error,setError]=useState("");
  const [category,setCategory]=useState("Todos");
  const visible=products.filter((p)=>p.active&&(category==="Todos"||p.category===category));
  const add=(id:string,delta=1)=>setCart((current)=>({...current,[id]:Math.max(0,(current[id]||0)+delta)}));
  const lines=products.filter((p)=>cart[p.id]).map((p)=>({...p,quantity:cart[p.id]}));
  function identify() {
    const clean = doc.replace(/\D/g, "");
    const found = customers.find((item) => item.document.replace(/\D/g, "") === clean);
    if (!found) {
      setError("Cliente não encontrado. Confira o documento ou procure o atendimento.");
      return;
    }
    setCustomer(found);
    setError("");
  }
  function finish(){if(!customer||!lines.length)return;const order=createOrder({channel:"B2B",status:"WAITING_PRICING",customerId:customer.id,customerName:customer.name,document:customer.document,paymentTerms:customer.paymentTerms,customerNote:note,items:lines.map((line)=>({productId:line.id,name:line.name,quantity:line.quantity}))});setDone(order.number);}
  function reset(){setDone(null);setCustomer(null);setCart({});setDoc("");setNote("");setCategory("Todos");}

  if(done) return <main className="page dark"><div className="shell kiosk-shell"><Topbar mode="CLIENTE B2B" kiosk/><div className="panel done-card"><div className="eyebrow">Solicitação recebida</div><div className="done-number">#{done}</div><p className="subtitle">Seu pedido foi enviado ao comercial. Os valores serão definidos conforme sua condição comercial antes do faturamento.</p><button className="btn big-btn" onClick={reset}>FINALIZAR</button></div></div></main>;

  if(!customer) return <main className="page dark"><div className="shell kiosk-shell"><Topbar mode="CLIENTE B2B" kiosk/><div style={{maxWidth:820,margin:"8vh auto"}}><div className="eyebrow">Área de clientes</div><h1 className="title">Acesse sua conta.</h1><p className="subtitle">Informe o documento. Nesta modalidade os preços são definidos posteriormente pelo comercial.</p><div className="panel stack" style={{marginTop:30,padding:26}}><label className="eyebrow" htmlFor="documento">Documento</label><input id="documento" className="field" value={doc} onChange={(e)=>setDoc(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter")identify()}} placeholder="Digite o documento fictício"/><button className="btn big-btn" onClick={identify}>CONTINUAR</button>{error&&<div className="notice">{error}<br/><strong>Para testar: 00.000.000/0000-00</strong></div>}</div></div></div></main>;

  return <main className="page dark"><div className="shell kiosk-shell"><Topbar mode="CLIENTE B2B" kiosk/><div className="split"><section>
    <div className="customer-card"><div><div className="eyebrow">Cliente identificado</div><h3>{customer.name}</h3><div className="customer-meta">{customer.document}<br/>{customer.salesRep} · {customer.paymentTerms}</div></div><button className="btn ghost" onClick={()=>setCustomer(null)}>TROCAR</button></div>
    <div className="eyebrow">Pedido comercial</div><h1 className="title title-small">Selecione os produtos.</h1><p className="subtitle">Informe apenas os itens e quantidades. O comercial receberá o pedido para precificação.</p>
    <div className="category-tabs">{categories.map((item)=><button key={item} className={`category-tab ${category===item?"active":""}`} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className="product-grid">{visible.map((product)=><button className="product" key={product.id} onClick={()=>add(product.id)}><ProductVisual accent={product.accent} label={product.category}/><div className="product-body"><div><h3>{product.shortName}</h3><p>{product.name} · {product.unit}</p></div><div className="product-bottom"><div><div className="eyebrow">Preço comercial</div><strong>A combinar</strong></div><span className="add-badge">+</span></div></div></button>)}</div>
  </section><aside className="panel cart"><div className="row-between"><h2 className="section-title">Seu pedido</h2><span className="badge">Sem preços</span></div>{!lines.length&&<div className="cart-empty">Selecione os produtos desejados.</div>}{lines.map((line)=><div className="cart-line" key={line.id}><div className="cart-product"><strong>{line.shortName}</strong><span>{line.unit}</span></div><div className="qty"><button onClick={()=>add(line.id,-1)}>−</button><strong>{line.quantity}</strong><button onClick={()=>add(line.id,1)}>+</button></div></div>)}<div className="hr"/><label className="eyebrow" htmlFor="obs">Observação opcional</label><textarea id="obs" className="field textarea" placeholder="Ex.: entregar amanhã cedo" value={note} onChange={(e)=>setNote(e.target.value)}/><button className="btn big-btn full" disabled={!lines.length} onClick={finish}>ENVIAR AO COMERCIAL</button></aside></div></div></main>;
}
