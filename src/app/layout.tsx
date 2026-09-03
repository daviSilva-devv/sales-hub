import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Hub — Portfólio",
  description: "Demonstração fictícia de um fluxo comercial",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
