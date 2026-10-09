/**
 * Order resolution — trusted server-side pricing & shaping.
 *
 * The API route hands over *validated raw input*; this module re-reads every
 * product from the catalog (never trusting the browser) and computes totals.
 */

import { products } from "@/lib/data";

export interface ResolvedItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface ResolvedOrder {
  orderId: string;
  orderDateLabel: string;
  deliveryLabel: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: ResolvedItem[];
  total: number;
  customerNote?: string;
  paymentReference?: string;
}

export function resolveItems(
  rawItems: Array<{ productId: string; quantity: number }>,
): { items: ResolvedItem[]; total: number } | null {
  const byId = new Map(products.map((p) => [p.id, p]));
  const items: ResolvedItem[] = [];

  for (const raw of rawItems) {
    const product = byId.get(raw.productId);
    if (!product || !product.available) return null;
    items.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price, // trusted catalog price — browser value ignored
      quantity: raw.quantity,
      lineTotal: product.price * raw.quantity,
    });
  }

  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, total };
}
