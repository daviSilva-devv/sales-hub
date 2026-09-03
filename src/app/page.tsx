import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const routes = [
  ["01", "Totem Varejo", "Venda touch com preço, promoção, cupom e carrinho.", "/totem/varejo"],
  ["02", "Totem Cliente", "Área B2B por documento, catálogo sem preço e envio ao comercial.", "/totem/cliente"],
  ["03", "Operação Varejo", "Pedidos novos, preparação e retirada no PC da loja.", "/operacao/varejo"],
  ["04", "Comercial", "Precificação, lote/data, observação e liberação para faturamento.", "/comercial"],
  ["05", "Faturamento", "Fila pronta para digitação no fiscal atual.", "/faturamento"],
  ["06", "Admin", "Produtos, clientes, campanhas, cupons e visão da operação.", "/admin"],
];

export default function Home() {
  return (
    <main className="page">
      <div className="shell">
        <div className="topbar"><BrandMark /><span className="mode-pill">DEMO DE PORTFÓLIO</span></div>
        <div className="hero">
          <div>
            <div className="eyebrow">Demonstração local</div>
            <h1 className="title">Venda, comercial<br/>e faturamento.</h1>
            <p className="subtitle">Fluxos fictícios de varejo e B2B compartilham o mesmo núcleo de pedidos e histórico de alterações.</p>
          </div>
          <div className="panel panel-soft" style={{maxWidth:390}}>
            <div className="eyebrow">Teste recomendado</div>
            <strong style={{display:"block",fontSize:18,margin:"8px 0 6px"}}>Empório Horizonte (demo)</strong>
            <div className="muted small">Documento fictício: 00.000.000/0000-00</div>
          </div>
        </div>
        <div className="launch-strip"><strong>Modo demonstração</strong><span>Pedidos sincronizam entre abas do mesmo navegador usando armazenamento local.</span></div>
        <div className="grid">
          {routes.map(([number,title,desc,href]) => (
            <Link key={href} className="panel route-card" href={href}>
              <div><div className="route-number">{number}</div><strong>{title}</strong><p>{desc}</p></div>
              <div className="route-open">Abrir módulo →</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
