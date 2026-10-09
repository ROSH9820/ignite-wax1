# Ignite Wax — Premium Candle Website

Production-ready website for **Ignite Wax**, built from the supplied reference
mockup (light warm theme, forest green + terracotta, rounded organic style).

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**
- **Framer Motion** — subtle, reduced-motion-aware animations
- **Resend** — transactional email (REST API, no SDK lock-in)
- **No database (v1)** — architecture ready for PostgreSQL in Phase 2

## Quick start

```bash
cp .env.example .env   # fill in your values
bun install
bun run dev            # http://localhost:3000
```

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, bestsellers, value banner |
| `/shop` | All products with scent-family filter pills (All, Floral, Woody, Warm, Fresh) |
| `/shop/[slug]` | Product details, quantity, order + WhatsApp CTAs, accordions |
| `/order` | Clean order form → UPI payment panel → confirmation |
| `/about` `/contact` `/privacy` `/terms` | Supporting pages |
| `/collections` `/wellness` | Editorial collections and rituals pages |
| `/admin` `/admin/orders` `/admin/products` | Admin dashboard (Phase 1 password gate — default `ignite2026`, override with `ADMIN_PASSWORD`) |

## Architecture

```text
src/lib/types.ts   — strict TypeScript data contract (Product, Order, Customer…)
src/lib/data.ts    — Phase 1 mock JSON data (products + demo admin orders)
src/lib/api.ts     — the ONLY data access layer the UI may call
                     (Phase 2: swap these function bodies to Supabase/PostgreSQL,
                      not a single component changes)
```

## Order flow (v1 — no payment gateway)

```
Customer → Order form → POST /api/order (validated server-side)
         → Order ID IW-YYYY-##### (server-generated)
         → Delivery estimate 7–14 days (server-computed)
         → Emails via Resend: business notification + customer acknowledgement
         → UPI payment panel (QR + copy UPI ID, optional UTR)
         → POST /api/order/payment-note → confirmation page
```

- Prices, product details, order IDs and delivery dates are **always computed
  server-side** from the trusted catalog (`src/lib/data.ts` via `src/lib/order-data.ts`) —
  browser values are never trusted.
- Anti-spam: in-memory rate limiting (5/min/IP), honeypot field, optional
  Cloudflare Turnstile (`TURNSTILE_SECRET_KEY`).
- Emails are sent via Resend; if `RESEND_API_KEY` is unset they are logged to
  the server console (dev mode).

## Adding a product

1. Add `/public/images/products/<slug>.jpg`
2. Append an entry in `src/lib/data.ts`

Shop grid, product page, search, sitemap, admin and the order form update
automatically — everything reads through `src/lib/api.ts`.

## Admin dashboard (Phase 1)

`/admin` is gated by a simple shared password (`ADMIN_PASSWORD` env var,
default `ignite2026`) stored in an httpOnly cookie. Orders and Products
tables read demo data through `lib/api.ts`:

- **Orders** — “Mark as Shipped” updates local UI state (no DB yet).
- **Products** — the Edit modal updates UI state and shows the documented
  workflow toast: *“In Phase 1, copy this updated JSON and paste it into
  lib/data.ts. In Phase 2, this will save to PostgreSQL.”* A **Copy JSON**
  button puts the edited record on your clipboard for pasting into `lib/data.ts`.

## Push to GitHub

The repo tracks website code only — `.env`, runtime data, mockup deliverables
and sandbox tooling are gitignored, and history contains no secrets.

```bash
git remote add origin https://github.com/<you>/IgniteWax.git
git push -u origin main        # paste a fine-grained PAT when prompted
```

Fine-grained PAT needs **Contents: Read and write** on the target repo.
Never commit real tokens or `.env` — CI/CD and collaborators only need
`.env.example`.

## Deployment (Cloudflare free tier)

The project is standard Next.js App Router with Node-runtime API routes. For
Cloudflare, deploy via **@opennextjs/cloudflare** (or a Node host on the free
tier of your choice):

```bash
bun add @opennextjs/cloudflare
bunx opennextjs-cloudflare build
bunx opennextjs-cloudflare deploy
```

Set all secrets in the Cloudflare dashboard (never in code). Use `wrangler`
config to enable `nodejs_compat`. Free-tier friendly by design: Resend free
(100 emails/day), Turnstile free, no database required.

## Replacing placeholders

Search the codebase for `PLACEHOLDER` and `[` markers:

- Logo: `src/components/site/logo.tsx` (inline SVG — swap for real asset)
- WhatsApp number: `NEXT_PUBLIC_WHATSAPP_NUMBER`
- UPI ID + QR: `UPI_ID`, replace `public/images/site/upi-qr-placeholder.png`
- Business email / address: `BUSINESS_EMAIL`, contact page
- Product photos & copy: `src/data/products.ts`
- Testimonials: `src/components/home/testimonials.tsx` (marked placeholder)

## Roadmap

- **Phase 2**: PostgreSQL (orders, order status, inventory), admin dashboard
  — `generateOrderId()` swaps its file counter for a DB sequence; API routes
  gain persistence without signature changes.
- **Phase 3**: payment gateway, auto payment verification, WhatsApp
  notifications, coupons, reviews, wishlist.
- **Phase 4**: analytics, abandoned cart, delivery tracking.
