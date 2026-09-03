import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function Topbar({ mode, kiosk = false }: { mode: string; kiosk?: boolean }) {
  return (
    <div className="topbar">
      <div className="topbar-brand"><BrandMark /><span className="mode-pill">{mode}</span></div>
      {!kiosk && <Link className="top-link" href="/">Central</Link>}
    </div>
  );
}
