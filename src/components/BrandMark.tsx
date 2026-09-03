export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark" aria-label="Mercado Aurora">
      <div className="brand-symbol" aria-hidden="true"><span /></div>
      {!compact && <div><div className="brand-name">MERCADO AURORA</div><div className="brand-sub">Sales Hub</div></div>}
    </div>
  );
}
