/**
 * Strict TypeScript interfaces — the data contract for the entire app.
 *
 * Every UI component consumes these types through `lib/api.ts` only.
 * When Phase 2 (Supabase / PostgreSQL) lands, the implementations inside
 * `lib/api.ts` change — not a single component does.
 */

/** Scent families — the shop filter pills (All, Floral, Woody, Warm, Fresh). */
export type ProductCategory = "Floral" | "Woody" | "Warm" | "Fresh";

/** Card image-well tints — keeps product photography cohesive with the brand. */
export type ProductTint = "sage" | "blush" | "peach" | "cream" | "lilac";

export interface ScentNotes {
  top: string;
  heart: string;
  base: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** Short one-liner shown on cards */
  description: string;
  /** Longer story shown on the product page */
  details: string;
  /** Price in whole rupees (INR) — e.g. 28 renders as ₹28 */
  price: number;
  /** Path under /public */
  image: string;
  category: ProductCategory;
  /** Scent line, e.g. "Eucalyptus + Mint" */
  fragrance: string;
  /** Structured notes for the product-page accordion */
  scentNotes: ScentNotes;
  available: boolean;
  /** Units on hand — drives the admin Low Stock stat (<= 5 is low) */
  stock: number;
  tint: ProductTint;
  weight: string;
  burnTime: string;
  /** Featured in the hero floating card and/or bestsellers grid */
  bestseller?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  /** Optional detail lines — folded into the single Address field in v1 */
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = "Pending" | "Shipped" | "Delivered";

/**
 * Order as seen by the admin dashboard.
 * Phase 1: mock records from lib/data.ts.
 * Phase 2: rows fetched from PostgreSQL through the same interface.
 */
export interface Order {
  id: string;
  /** ISO date string */
  date: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: OrderStatus;
}

export interface AdminStats {
  /** Orders placed in the current calendar month */
  ordersThisMonth: number;
  /** Estimated revenue across all recorded orders */
  revenueEstimate: number;
  /** Products with stock <= 5 */
  lowStockCount: number;
}

/** Payload accepted by POST /api/order (mirrors lib/validation.ts). */
export interface SubmitOrderPayload {
  customer: Customer;
  items: OrderItem[];
  note?: string;
  /** Honeypot — must stay empty */
  company?: string;
}

export interface SubmitOrderResult {
  orderId: string;
  deliveryLabel: string;
  items: Array<{ id: string; name: string; slug: string; price: number; quantity: number; lineTotal: number }>;
  total: number;
  emailsSent?: {
    business: boolean;
    customer: boolean;
    /** Detailed delivery status so the UI can be honest about what happened. */
    customerStatus?: "sent" | "not-configured" | "failed";
    /** Short human-readable reason when the customer email was not delivered. */
    customerReason?: string;
  };
}
