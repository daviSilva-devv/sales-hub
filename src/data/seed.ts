import type { Coupon, Customer, Product } from "@/domain/types";

export const products: Product[] = [
  { id: "p1", sku: "CAF-500", name: "Café torrado 500 g", shortName: "Café 500 g", category: "Mercearia", retailPrice: 24.5, promoPrice: 21.9, unit: "pacote", active: true, featured: true, accent: "#b7865b" },
  { id: "p2", sku: "GRN-300", name: "Granola tradicional 300 g", shortName: "Granola 300 g", category: "Mercearia", retailPrice: 18.4, unit: "pacote", active: true, accent: "#d2aa6d" },
  { id: "p3", sku: "MEL-250", name: "Mel silvestre 250 g", shortName: "Mel 250 g", category: "Naturais", retailPrice: 27.8, promoPrice: 24.9, unit: "pote", active: true, featured: true, accent: "#e0aa35" },
  { id: "p4", sku: "CHA-020", name: "Chá de ervas com 20 sachês", shortName: "Chá de ervas", category: "Naturais", retailPrice: 14.6, unit: "caixa", active: true, accent: "#8fa36b" },
  { id: "p5", sku: "BIS-180", name: "Biscoito integral 180 g", shortName: "Biscoito integral", category: "Lanches", retailPrice: 11.2, unit: "pacote", active: true, accent: "#c79762" },
  { id: "p6", sku: "GEI-240", name: "Geleia de frutas 240 g", shortName: "Geleia 240 g", category: "Lanches", retailPrice: 19.7, unit: "pote", active: true, accent: "#b96b63" },
];

export const customers: Customer[] = [
  { id: "c1", document: "00.000.000/0000-00", name: "Empório Horizonte (demo)", salesRep: "Equipe comercial", paymentTerms: "Condição demonstrativa" },
  { id: "c2", document: "000.000.000-00", name: "Cliente Exemplo", salesRep: "Equipe comercial", paymentTerms: "7 dias (demo)" },
];

export const coupons: Coupon[] = [
  { code: "BEMVINDO10", label: "Boas-vindas 10%", discountType: "PERCENT", discountValue: 10, minOrder: 40, campaign: "Campanha de demonstração A", active: true },
  { code: "FEIRA12", label: "Feira R$ 12", discountType: "FIXED", discountValue: 12, minOrder: 70, campaign: "Campanha de demonstração B", active: true },
  { code: "PAUSA5", label: "Cupom inativo", discountType: "PERCENT", discountValue: 5, minOrder: 20, campaign: "Campanha encerrada", active: false },
];

export const categories = ["Todos", ...Array.from(new Set(products.map((product) => product.category)))];
