export function ProductVisual({ accent, label }: { accent: string; label: string }) {
  return (
    <div className="product-visual" style={{ "--product-accent": accent } as React.CSSProperties} aria-hidden="true">
      <div className="product-shape shape-a" />
      <div className="product-shape shape-b" />
      <div className="product-shape shape-c" />
      <span>{label}</span>
    </div>
  );
}
