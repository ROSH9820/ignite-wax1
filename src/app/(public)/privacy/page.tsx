import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ignite Wax collects, uses and protects your personal information — plain language, no dark patterns.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What we collect",
    body: "When you place an order we collect your name, email address, phone number and delivery address — only what we need to fulfil it. When you contact us we collect your name, email and message. We do not collect payment card details: payments are made manually via UPI or bank transfer outside this website.",
  },
  {
    title: "How we use it",
    body: "Your details are used to prepare, deliver and support your order, to send transactional emails (order confirmation and payment instructions), and to reply to enquiries. We never sell, rent or trade your personal information to third parties for marketing.",
  },
  {
    title: "Email and communications",
    body: "Transactional emails are delivered through our email provider (Resend). If you message us on WhatsApp, that conversation is governed by WhatsApp's own privacy policy in addition to this one.",
  },
  {
    title: "Analytics and cookies",
    body: "This website stores a small preference in your browser's local storage for the shopping-bag indicator. We do not use advertising cookies or cross-site trackers. If we add privacy-friendly analytics later, this policy will be updated before that happens.",
  },
  {
    title: "Data retention",
    body: "Order details are retained for as long as needed for accounting, warranty and dispute purposes. You may request deletion of your personal data at any time by emailing us, subject to legal retention requirements.",
  },
  {
    title: "Your rights",
    body: "You may request a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. Email us and we will respond within one business week.",
  },
  {
    title: "Changes to this policy",
    body: "If we change this policy we will update this page and revise the date below. Material changes will be highlighted on the website.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header>
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-body">
          Last updated: 6 October 2026 · Placeholder policy — review with legal
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
