/**
 * Mock data source (Phase 1).
 *
 * All product and demo-order records live here. Nothing in the UI imports
 * this file directly — components go through `lib/api.ts`, which is the only
 * module allowed to read it. When Phase 2 lands, `lib/api.ts` swaps to
 * Supabase/PostgreSQL and this file becomes seed data.
 *
 * ── HOW TO ADD A NEW CANDLE ──────────────────────────────────────────────
 * 1. Drop the product photo into /public/images/products/<slug>.jpg
 * 2. Copy any object below, give it a unique `id` + `slug`, and update the
 *    fields. Shop grid, product pages, search and the order form pick it up
 *    automatically — no other code changes required.
 */

import type { Order, Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "candle-001",
    name: "Serenity",
    slug: "serenity",
    description: "A refreshing blend that clears the mind and soothes the soul.",
    details:
      "Our bestselling signature candle. Cool eucalyptus and crisp mint unfold over a clean soy-wax base, filling the room with the calm of a morning spa ritual. Hand-poured in small batches with a cotton wick and a reusable frosted-glass vessel.",
    price: 28,
    image: "/images/products/serenity.jpg",
    category: "Fresh",
    fragrance: "Eucalyptus + Mint",
    scentNotes: {
      top: "Eucalyptus, Spearmint",
      heart: "Garden Mint, Clary Sage",
      base: "Cedarwood, White Musk",
    },
    available: true,
    stock: 24,
    tint: "sage",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    bestseller: true,
    rating: 4.9,
    reviewCount: 126,
  },
  {
    id: "candle-002",
    name: "Bloom",
    slug: "bloom",
    description: "A soft, floral embrace that brings comfort and joy.",
    details:
      "Garden peonies and damask rose warmed by a whisper of soft musk. Bloom is a gentle floral that never overwhelms — think fresh sheets, morning light and a vase of just-opened roses.",
    price: 28,
    image: "/images/products/bloom.jpg",
    category: "Floral",
    fragrance: "Peony + Rose",
    scentNotes: {
      top: "Peony Petals, Pear",
      heart: "Damask Rose, Geranium",
      base: "Soft Musk, Sandalwood",
    },
    available: true,
    stock: 3,
    tint: "blush",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    bestseller: true,
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "candle-003",
    name: "Forest Walk",
    slug: "forest-walk",
    description: "Earthy and grounding, like a peaceful walk in the woods.",
    details:
      "Crushed pine needles, cedarwood and damp earth. Forest Walk brings the quiet of a woodland trail indoors — grounding, resinous and deeply restorative after a long day.",
    price: 28,
    image: "/images/products/forest-walk.jpg",
    category: "Woody",
    fragrance: "Pine + Cedarwood",
    scentNotes: {
      top: "Pine Needles, Bergamot",
      heart: "Cedarwood, Cypress",
      base: "Damp Earth, Vetiver",
    },
    available: true,
    stock: 18,
    tint: "sage",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    bestseller: true,
    rating: 4.8,
    reviewCount: 87,
  },
  {
    id: "candle-004",
    name: "Vanilla Cloud",
    slug: "vanilla-cloud",
    description: "Warm, creamy, and dreamy. Pure relaxation.",
    details:
      "Madagascan vanilla folded into coconut cream and a touch of tonka. Vanilla Cloud is comfort in candle form — mellow, sweet and impossibly cozy.",
    price: 28,
    image: "/images/products/vanilla-cloud.jpg",
    category: "Warm",
    fragrance: "Vanilla + Coconut",
    scentNotes: {
      top: "Coconut Cream, Almond",
      heart: "Madagascan Vanilla, Tonka",
      base: "Warm Benzoin, Heliotrope",
    },
    available: true,
    stock: 12,
    tint: "cream",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    bestseller: true,
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: "candle-005",
    name: "Sunset",
    slug: "sunset",
    description: "A warm, soothing glow to end your day beautifully.",
    details:
      "Golden sandalwood and soft amber glow like the last light of dusk. Sunset is our warmest blend — mellow, resinous and made for slow evenings.",
    price: 28,
    image: "/images/products/sunset.jpg",
    category: "Warm",
    fragrance: "Sandalwood + Amber",
    scentNotes: {
      top: "Golden Bergamot, Plum",
      heart: "Sandalwood, Amber",
      base: "Tonka Bean, Vanilla",
    },
    available: true,
    stock: 7,
    tint: "peach",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    bestseller: true,
    rating: 4.7,
    reviewCount: 76,
  },
  {
    // ── PLACEHOLDER PRODUCT — replace with real details when available ──
    id: "candle-006",
    name: "Lavender Dream",
    slug: "lavender-dream",
    description: "Lavender fields at dusk, distilled into stillness.",
    details:
      "French lavender softened with chamomile and a dusting of sweet balsam. Light it an hour before bed and let the day dissolve. (Placeholder product — details to be confirmed.)",
    price: 26,
    image: "/images/products/lavender-dream.jpg",
    category: "Floral",
    fragrance: "Lavender + Chamomile",
    scentNotes: {
      top: "French Lavender, Lemon",
      heart: "Chamomile, Orange Blossom",
      base: "Sweet Balsam, Musk",
    },
    available: true,
    stock: 4,
    tint: "lilac",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    rating: 4.8,
    reviewCount: 54,
  },
  {
    // ── PLACEHOLDER PRODUCT — replace with real details when available ──
    id: "candle-007",
    name: "Amber Dusk",
    slug: "amber-dusk",
    description: "Golden amber and warm musk for slow golden hours.",
    details:
      "Rich golden amber wrapped in warm musk and a hint of smoked vanilla. Amber Dusk glows beautifully on winter evenings. (Placeholder product — details to be confirmed.)",
    price: 32,
    image: "/images/products/amber-dusk.jpg",
    category: "Woody",
    fragrance: "Golden Amber + Musk",
    scentNotes: {
      top: "Smoked Vanilla, Clove",
      heart: "Golden Amber, Labdanum",
      base: "Warm Musk, Guaiac Wood",
    },
    available: true,
    stock: 9,
    tint: "peach",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    rating: 4.7,
    reviewCount: 41,
  },
  {
    // ── PLACEHOLDER PRODUCT — replace with real details when available ──
    id: "candle-008",
    name: "Morning Calm",
    slug: "morning-calm",
    description: "Bright lemongrass and ginger to greet the day gently.",
    details:
      "Zesty lemongrass lifted with fresh ginger and a squeeze of sweet orange. Morning Calm is sunshine in a jar — clean, uplifting and never sharp. (Placeholder product — details to be confirmed.)",
    price: 24,
    image: "/images/products/morning-calm.jpg",
    category: "Fresh",
    fragrance: "Lemongrass + Ginger",
    scentNotes: {
      top: "Lemongrass, Sweet Orange",
      heart: "Fresh Ginger, Green Tea",
      base: "White Cedar, Verbena",
    },
    available: true,
    stock: 14,
    tint: "cream",
    weight: "8 oz / 226 g",
    burnTime: "~45 hours",
    rating: 4.6,
    reviewCount: 33,
  },
];

/**
 * Demo orders for the admin dashboard (Phase 1 mock data).
 * These are sample records — real customer orders arrive by email until
 * Phase 2 connects this table to PostgreSQL.
 */
export const mockOrders: Order[] = [
  {
    id: "IW-2026-00012",
    date: "2026-10-05",
    customerName: "Aarav Mehta",
    customerEmail: "aarav@example.com",
    items: [{ name: "Serenity", quantity: 2 }],
    total: 56,
    status: "Shipped",
  },
  {
    id: "IW-2026-00011",
    date: "2026-10-04",
    customerName: "Sofia Fernandez",
    customerEmail: "sofia@example.com",
    items: [
      { name: "Bloom", quantity: 1 },
      { name: "Vanilla Cloud", quantity: 1 },
    ],
    total: 56,
    status: "Pending",
  },
  {
    id: "IW-2026-00010",
    date: "2026-10-03",
    customerName: "Rahul Kapoor",
    customerEmail: "rahul.k@example.com",
    items: [{ name: "Forest Walk", quantity: 1 }],
    total: 28,
    status: "Shipped",
  },
  {
    id: "IW-2026-00009",
    date: "2026-10-01",
    customerName: "Emma Walsh",
    customerEmail: "emma.w@example.com",
    items: [{ name: "Sunset", quantity: 3 }],
    total: 84,
    status: "Pending",
  },
  {
    id: "IW-2026-00008",
    date: "2026-09-28",
    customerName: "Priya Nair",
    customerEmail: "priya.n@example.com",
    items: [
      { name: "Serenity", quantity: 1 },
      { name: "Morning Calm", quantity: 1 },
    ],
    total: 52,
    status: "Delivered",
  },
  {
    id: "IW-2026-00007",
    date: "2026-09-24",
    customerName: "Daniel Kim",
    customerEmail: "d.kim@example.com",
    items: [{ name: "Amber Dusk", quantity: 2 }],
    total: 64,
    status: "Delivered",
  },
  {
    id: "IW-2026-00006",
    date: "2026-09-20",
    customerName: "Ishita Roy",
    customerEmail: "ishita.r@example.com",
    items: [{ name: "Lavender Dream", quantity: 1 }],
    total: 26,
    status: "Delivered",
  },
];
