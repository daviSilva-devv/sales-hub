"use client";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { ProductVisual } from "@/components/ProductVisual";
import { categories, coupons, products } from "@/data/seed";
import { brl } from "@/lib/format";
import { createOrder } from "@/lib/demo-store";
import { couponDiscount, effectiveRetailPrice, normalizeCouponCode } from "@/lib/pricing";
import type { Coupon } from "@/domain/types";

export default function RetailTotem() {
  const [cart,setCart] = useState<Record<string,number>>({});
  const [done,setDone] = useState<number|null>(null);
  const [category,setCategory] = useState("Todos");
  const [couponOpen,setCouponOpen] = useState(false);
  const [couponText,setCouponText] = useState("");
  const [coupon,setCoupon] = useState<Coupon|null>(null);
  const [couponMessage,setCouponMessage] = useState("");
  const visible = products.filter((p) => p.active && (category === "Todos" || p.category === category));
  const lines = products.filter((p) => cart[p.id]).map((p) => ({...p, quantity: cart[p.id]}));
  const subtotal = useMemo(() => lines.reduce((sum,line) => sum + effectiveRetailPrice(line) * line.quantity, 0), [lines]);
  const discount = couponDiscount(subtotal,coupon);
  const total = Math.max(0,subtotal-discount);
  const add = (id:string,delta=1) => setCart((current) => ({...current,[id]:Math.max(0,(current[id]||0)+delta)}));

  function applyCoupon(){
    const code = normalizeCouponCode(couponText);
    const found = coupons.find((item) => item.code === code && item.active) || null;
    if(!found){setCoupon(null);setCouponMessage("Cupom não encontrado.");return;}
    if(subtotal < found.minOrder){setCoupon(null);setCouponMessage(`Pedido mínimo de ${brl(found.minOrder)} para este cupom.`);return;}
    setCoupon(found);setCouponText(found.code);setCouponMessage(`${found.code} aplicado com sucesso.`);
  }

  function finish(){
    if(!lines.length) return;
    const order = createOrder({
      channel:"RETAIL",
      status:"CREATED",
      couponCode:coupon?.code,
      subtotal,
      discount,
      total,
      items:lines.map((line) => ({productId:line.id,name:line.name,quantity:line.quantity,unitPrice:effectiveRetailPrice(line)})),
    });
    setDone(order.number);setCart({});setCoupon(null);setCouponText("");setCouponMessage("");
  }

  if(done) return (
    <main className="page"><div className="shell kiosk-shell"><Topbar mode="TOTEM VAREJO" kiosk />
      <div className="panel done-card"><div className="eyebrow">Pedido enviado para a loja</div><div className="done-number">#{done}</div><p className="subtitle">Seu pedido já apareceu no painel de operação.</p><button className="btn big-btn" onClick={() => setDone(null)}>FAZER NOVO PEDIDO</button></div>
    </div></main>
  );

  return (
    <main className="page"><div className="shell kiosk-shell"><Topbar mode="TOTEM VAREJO" kiosk />
      <div className="split">
        <section>
          <div className="catalog-head"><div><div className="eyebrow">Autoatendimento</div><h1 className="title title-small">Escolha seus produtos.</h1><p className="subtitle">Toque no produto para adicionar ao pedido.</p></div></div>
          <div className="category-tabs">{categories.map((item) => <button key={item} className={`category-tab ${category===item?"active":""}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="product-grid">
            {visible.map((product) => <button className="product" key={product.id} onClick={() => add(product.id)}>
              <ProductVisual accent={product.accent} label={product.category} />
              <div className="product-body"><div>{product.promoPrice && <span className="promo-tag">Oferta</span>}<h3>{product.shortName}</h3><p>{product.name} · {product.unit}</p></div>
                <div className="product-bottom"><div>{product.promoPrice && <div className="price-old">{brl(product.retailPrice)}</div>}<div className="price">{brl(effectiveRetailPrice(product))}</div></div><span className="add-badge">+</span></div>
              </div>
            </button>)}
          </div>
        </section>
        <aside className="panel cart">
          <div className="row-between"><h2 className="section-title">Seu pedido</h2><span className="badge">Varejo</span></div>
          {!lines.length && <div className="cart-empty">Seu carrinho está vazio.<br/>Toque em um produto para começar.</div>}
          {lines.map((line) => <div className="cart-line" key={line.id}><div className="cart-product"><strong>{line.shortName}</strong><span>{brl(effectiveRetailPrice(line))} / {line.unit}</span></div><div className="qty"><button onClick={() => add(line.id,-1)}>−</button><strong>{line.quantity}</strong><button onClick={() => add(line.id,1)}>+</button></div></div>)}
          {!!lines.length && <>
            <div className="summary-lines"><div className="summary-line"><span>Subtotal</span><span>{brl(subtotal)}</span></div>{discount>0 && <div className="summary-line discount"><span>Cupom {coupon?.code}</span><span>− {brl(discount)}</span></div>}</div>
            <div className="total"><span>Total</span><span>{brl(total)}</span></div>
          </>}
          <button className="btn big-btn full" disabled={!lines.length} onClick={finish}>CONFIRMAR PEDIDO</button>
          <button className="btn ghost full" style={{marginTop:10}} onClick={() => setCouponOpen((value) => !value)}>TENHO UM CUPOM</button>
          {couponOpen && <div className="coupon-box"><div className="coupon-row"><input className="field" value={couponText} onChange={(e) => setCouponText(e.target.value)} placeholder="Ex.: BEMVINDO10"/><button className="btn secondary" onClick={applyCoupon}>APLICAR</button></div>{couponMessage && <div className={coupon?"coupon-success":"coupon-error"}>{couponMessage}</div>}<div className="muted small" style={{marginTop:8}}>Demo: BEMVINDO10 · FEIRA12</div></div>}
        </aside>
      </div>
    </div></main>
  );
}
