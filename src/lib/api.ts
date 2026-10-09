/**
 * Data abstraction layer — the ONLY module the UI is allowed to talk to.
 *
 * Phase 1 reads from the local mock dataset in `lib/data.ts`.
 * Phase 2 will swap these function bodies to Supabase / PostgreSQL queries
 * without changing a single component, because every consumer depends on
 * the interfaces in `lib/types.ts`, never on the data source.
 */

import { mockOrders, products } from "@/lib/data";
import type {
  AdminStats,
  Order,
  Product,
  ProductCategory,
  SubmitOrderPayload,
  SubmitOrderResult,
} from "@/lib/types";

/* ── Catalog ────────────────────────────────────────────────────────────── */

export function fetchProducts(): Product[] {
  return products;
}

export function fetchProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Bestsellers for the home grid — the four candles from the reference design
 * (Bloom, Forest Walk, Vanilla Cloud, Sunset). Serenity is flagged bestseller
 * because it stars in the hero card, so it is excluded here.
 */
export function fetchBestsellers(): Product[] {
  return products.filter((p) => p.bestseller && p.slug !== "serenity").slice(0, 4);
}

export function fetchProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

/** Products currently available for ordering (server also re-checks this). */
export function fetchAvailableProducts(): Product[] {
  return products.filter((p) => p.available);
}

/* ── Admin (Phase 1: mock) ─────────────────────────────────────────────── */

export function fetchOrders(): Order[] {
  return [...mockOrders].sort((a, b) => b.date.localeCompare(a.date));
}

export function computeAdminStats(): AdminStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const ordersThisMonth = mockOrders.filter((o) => {
    const d = new Date(o.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const revenueEstimate = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return { ordersThisMonth, revenueEstimate, lowStockCount };
}

/* ── Mutations (client → API routes) ───────────────────────────────────── */

/**
 * Submits an order through POST /api/order.
 * The server re-validates everything, re-prices from the trusted catalog,
 * generates the order ID and delivery window, and sends the emails.
 */
export async function submitOrder(
  payload: SubmitOrderPayload,
): Promise<{ ok: true; data: SubmitOrderResult } | { ok: false; message: string; errors?: Record<string, string> }> {
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (res.status === 429) {
      return {
        ok: false,
        message: "You're ordering a little too quickly. Please wait a moment and try again.",
      };
    }
    if (res.status === 400 && data?.errors) {
      return { ok: false, message: data.message ?? "Please review the highlighted fields.", errors: data.errors };
    }
    if (!res.ok) {
      return {
        ok: false,
        message:
          data?.message ??
          "We couldn't submit your order right now. Please try again in a moment or reach us on WhatsApp.",
      };
    }
    return { ok: true, data: data as SubmitOrderResult };
  } catch {
    return {
      ok: false,
      message: "We couldn't reach the server. Please check your connection and try again.",
    };
  }
}

/** Optional UTR payment reference — attached to an existing order. */
export async function submitPaymentNote(
  orderId: string,
  utr: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/order/payment-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, utr }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => null);
    return { ok: false, message: data?.message };
  } catch {
    return { ok: false };
  }
}
