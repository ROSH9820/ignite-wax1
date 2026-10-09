import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern purchases from Ignite Wax — orders, payment, delivery, returns and liability, in plain language.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "Orders",
    body: "Submitting the order form is an offer to purchase. An order is accepted when we confirm it by email with an order ID (format IW-YYYY-#####). Prices are shown in US dollars and may change; the price shown at the moment of your order is the price you pay.",
  },
  {
    title: "Payment",
    body: "Payment is made manually via UPI or bank transfer after your order is confirmed. Orders are dispatched once payment has been verified. We never ask for card details on this website.",
  },
  {
    title: "Delivery",
    body: "Estimated delivery is 7–14 days from order confirmation. Timescales are estimates, not guarantees — carriers may experience delays outside our control. Shipping is free within our standard delivery zones; remote areas may incur additional charges which we will confirm before dispatch.",
  },
  {
    title: "Returns and refunds",
    body: "If a candle arrives damaged, email us a photo within 48 hours and we will replace it or refund you in full. Because candles are consumable goods, we cannot accept returns for used items or change-of-mind on scents — but if something is genuinely wrong, contact us and we will make it right.",
  },
  {
    title: "Candle safety",
    body: "Never leave a burning candle unattended. Keep away from children, pets, drafts and flammable materials. Trim the wick to 5 mm before each burn. Follow the safety instructions printed on the base of every vessel.",
  },
  {
    title: "Liability",
    body: "To the maximum extent permitted by law, Ignite Wax's liability for any claim relating to a purchase is limited to the amount you paid for the product. Nothing in these terms limits liability that cannot be limited by law.",
  },
  {
    title: "Contact",
    body: "Questions about these terms? Email us or message on WhatsApp — details are on the contact page.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header>
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-body">
          Last updated: 6 October 2026 · Placeholder terms — review with legal
          counsel before going live.
        </p>
      </header>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-xl font-semibold text-ink">{s.title}</h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
