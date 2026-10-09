/**
 * Central site configuration.
 *
 * All business-specific values come from environment variables so they can be
 * swapped at deploy time (Cloudflare dashboard / .env) without touching code.
 * Until real values are provided, clearly-identified PLACEHOLDER defaults are
 * used — replace them via the environment, never in code.
 */

function env(key: string, placeholder: string): string {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : placeholder;
}

export const siteConfig = {
  name: "Ignite Wax",
  tagline: "Handmade with intention",
  description:
    "Thoughtfully handcrafted candles using clean, natural ingredients to elevate your space, enhance your mood, and support your well-being.",
  /** PLACEHOLDER — replace NEXT_PUBLIC_SITE_URL at deployment */
  url: env("NEXT_PUBLIC_SITE_URL", "https://ignitewax.example.com"),

  /** PLACEHOLDER — set BUSINESS_EMAIL (server-only, never exposed to client) */
  businessEmail: env("BUSINESS_EMAIL", "orders@ignitewax.example.com"),
  /** PLACEHOLDER — set CONTACT_EMAIL if different from business email */
  contactEmail: env("CONTACT_EMAIL", "hello@ignitewax.example.com"),

  /**
   * PLACEHOLDER — set NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER in international
   * format, digits only (e.g. 919876543210). Falls back to the legacy
   * NEXT_PUBLIC_WHATSAPP_NUMBER if the new variable is not set.
   */
  whatsappNumber: env(
    "NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER",
    env("NEXT_PUBLIC_WHATSAPP_NUMBER", "919999999999"),
  ),

  /** PLACEHOLDER — set UPI_ID (server-only) */
  upiId: env("UPI_ID", "ignitewax@upi"),
  /** PLACEHOLDER — set UPI_PAYEE_NAME (server-only) */
  upiPayeeName: env("UPI_PAYEE_NAME", "Ignite Wax"),

  /** Delivery timeline in days (min/max) — used to compute the estimate server-side */
  deliveryDaysMin: 7,
  deliveryDaysMax: 14,

  currency: "INR",
  currencySymbol: "₹",

  /** Instagram — public page + QR asset (scanned from the client-supplied code). */
  instagram: {
    handle: "@ignite_wax",
    url: "https://www.instagram.com/ignite_wax",
    qr: "/images/site/instagram-qr.png",
  },
} as const;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0, // Indian pricing convention — whole rupees
});

/** Formats an amount in Indian Rupees, e.g. 28 -> ₹28, 1299 -> ₹1,299 */
export function formatPrice(amount: number): string {
  return inrFormatter.format(amount);
}

/**
 * Builds a wa.me link with a pre-filled (URL-encoded) message.
 * `number` defaults to the configured business number; client components
 * pass the runtime-fetched number from /api/site-config so the link stays
 * correct even when the env var was only set after the last build.
 */
export function whatsappLink(message: string, number?: string): string {
  return `https://wa.me/${number ?? siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: "Hi Ignite Wax! I have a question about your candles.",
  product: (name: string) =>
    `Hi Ignite Wax! I'm interested in the ${name}. Could you tell me more about it?`,
  orderHelp: (orderId: string) =>
    `Hi Ignite Wax! I need help with my order ${orderId}.`,
  /**
   * Zero-cost order confirmation — pre-filled message sent with the customer
   * straight after checkout, so the business can confirm instantly on WhatsApp.
   */
  orderConfirmation: (o: {
    orderId: string;
    customerName: string;
    itemsText: string;
    total: string;
    email: string;
    phone: string;
  }) =>
    `Hi Ignite Wax! 👋\n\n` +
    `I just placed an order:\n` +
    `Order ID: #${o.orderId}\n` +
    `Name: ${o.customerName}\n` +
    `Items: ${o.itemsText}\n` +
    `Total: ${o.total}\n` +
    `Email: ${o.email}\n` +
    `Phone: ${o.phone}\n\n` +
    `Please confirm my order. Thank you! 🕯️`,
} as const;
