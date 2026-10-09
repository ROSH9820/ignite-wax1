"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAvailableProducts, submitOrder, submitPaymentNote } from "@/lib/api";
import { formatPrice, whatsappLink, whatsappMessages } from "@/lib/config";
import { useWhatsAppNumber } from "@/lib/use-whatsapp-number";
import type { SubmitOrderResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-2xl border border-input bg-softwhite px-4 py-3 text-[14.5px] text-ink placeholder:text-body/45 transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";

const labelBase = "mb-1.5 block text-[13px] font-bold text-ink";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{msg}</p>;
}

/** Official WhatsApp glyph (simple-icons path) for the brand-accurate CTA. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Clean single-page order form (per the reference design):
 * product selection, name, email, phone, address, notes → POST /api/order →
 * success screen with manual UPI / bank-transfer instructions.
 *
 * The server re-validates everything and never trusts this form for prices.
 */
export function OrderForm() {
  const params = useSearchParams();
  const preselected = params.get("product");
  const preQty = Math.min(20, Math.max(1, Number(params.get("qty")) || 1));

  const catalog = useMemo(() => fetchAvailableProducts(), []);

  const [productId, setProductId] = useState(
    () =>
      catalog.find((p) => p.slug === preselected)?.id ?? catalog[0]?.id ?? "candle-001",
  );
  const [qty, setQty] = useState(preQty);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    company: "", // honeypot — must stay empty
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<SubmitOrderResult | null>(null);
  const waNumber = useWhatsAppNumber();

  /* ── success screen state ── */
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrSent, setUtrSent] = useState(false);
  const [utrBusy, setUtrBusy] = useState(false);

  const product = useMemo(
    () => catalog.find((p) => p.id === productId) ?? catalog[0],
    [catalog, productId],
  );
  const total = (product?.price ?? 0) * qty;
  const upiId = process.env.NEXT_PUBLIC_UPI_ID_DISPLAY ?? "ignitewax@upi";

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  /* ── Submit ─────────────────────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldErrs({});
    setSubmitting(true);
    const result = await submitOrder({
      customer: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
      },
      items: [{ productId, quantity: qty }],
      note: form.note,
      company: form.company,
    });
    setSubmitting(false);

    if (!result.ok) {
      setServerError(result.message);
      if (result.errors) setFieldErrs(result.errors);
      return;
    }

    setConfirmed(result.data);
    toast.success("Order received", {
      description: `Your order ID is ${result.data.orderId}.`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Payment helpers ────────────────────────────────────────────────── */

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(`UPI ID: ${upiId}`);
    }
  }

  async function submitUtr() {
    const trimmed = utr.trim();
    if (!trimmed) return;
    setUtrBusy(true);
    const res = await submitPaymentNote(confirmed?.orderId ?? "", trimmed);
    setUtrBusy(false);
    if (res.ok) {
      setUtrSent(true);
      toast.success("Payment reference received", {
        description: "We'll match it with your payment shortly.",
      });
    } else {
      toast.error("Reference couldn't be submitted", {
        description: "No problem — share it with us on WhatsApp instead.",
      });
    }
  }

  /* ── Success screen ─────────────────────────────────────────────────── */

  if (confirmed) {
    // Zero-cost WhatsApp confirmation: pre-filled message with the full
    // order details, opened via a plain wa.me link — no API, no cost.
    const whatsappConfirmHref = whatsappLink(
      whatsappMessages.orderConfirmation({
        orderId: confirmed.orderId,
        customerName: form.fullName,
        itemsText: confirmed.items
          .map((i) => `${i.name} × ${i.quantity}`)
          .join(", "),
        total: formatPrice(confirmed.total),
        email: form.email,
        phone: form.phone,
      }),
      waNumber,
    );
    // Honest email status — the API reports whether the customer email was
    // actually accepted by the mail provider (Resend), and why not otherwise.
    // Legacy fallback: missing customerStatus means an older API — derive it
    // from the boolean; missing emailsSent entirely means very old — optimistic.
    const emailStatus =
      confirmed.emailsSent?.customerStatus ??
      (confirmed.emailsSent ? (confirmed.emailsSent.customer ? "sent" : "failed") : "sent");
    const emailReason = confirmed.emailsSent?.customerReason;

    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl"
      >
        {/* Confirmation card */}
        <div className="rounded-[2rem] bg-softwhite p-8 text-center soft-shadow sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-soft">
            <CheckCircle2 className="h-8 w-8 text-sage" strokeWidth={1.6} />
          </span>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-ink">
            Thank you, {form.fullName.split(" ")[0]}.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-body">
            Your order has been received and is being prepared with care.{" "}
            {emailStatus === "sent" ? (
              <>
                A confirmation email is on its way to{" "}
                <span className="font-semibold text-ink">{form.email}</span> — if it doesn't
                appear within a few minutes, please check your spam/junk folder.
              </>
            ) : emailStatus === "not-configured" ? (
              <>Email confirmations aren't switched on yet. We have your order safely and
              will confirm it personally on WhatsApp.</>
            ) : (
              <>
                We couldn't deliver a confirmation email
                {emailReason ? (
                  <span className="text-body/80"> ({emailReason})</span>
                ) : null}
                {" "}— but your order is safe and we'll confirm it personally on WhatsApp.
              </>
            )}
          </p>

          {/* Primary action — zero-cost WhatsApp order confirmation */}
          <div className="mt-7 flex flex-col items-center">
            <a
              href={whatsappConfirmHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp-bright px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-whatsapp-bright-deep sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Confirm Order on WhatsApp
            </a>
            <p className="mt-3 text-[13px] leading-relaxed text-body">
              Click the button above to confirm your order instantly via
              WhatsApp — fastest way to reach us.
            </p>
          </div>

          <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl bg-cream px-8 py-5">
            <span className="text-[11px] font-bold tracking-[0.22em] text-body uppercase">
              Your order ID
            </span>
            <span className="mt-1 font-serif text-2xl font-bold tracking-wide text-sage">
              {confirmed.orderId}
            </span>
            <span className="mt-2 flex items-center gap-1.5 text-[13px] text-body">
              <Truck className="h-4 w-4 text-sage" strokeWidth={1.6} />
              Estimated delivery: <b className="text-ink">{confirmed.deliveryLabel}</b>
            </span>
          </div>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
            {confirmed.items.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between rounded-xl bg-cream/70 px-4 py-2.5 text-sm"
              >
                <span className="text-ink">
                  {i.name} <span className="text-body">× {i.quantity}</span>
                </span>
                <span className="font-semibold text-ink">{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between px-4 pt-1 text-[15px]">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-bold text-ink">{formatPrice(confirmed.total)}</span>
            </li>
          </ul>
        </div>

        {/* Payment panel — manual UPI / bank transfer */}
        <div className="mt-6 rounded-[2rem] bg-softwhite p-8 soft-shadow sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-soft">
              <Package className="h-5 w-5 text-peach-deep" strokeWidth={1.6} />
            </span>
            <div>
              <h3 className="font-serif text-xl font-semibold text-ink">Complete your payment</h3>
              <p className="text-[13px] text-body">
                Manual verification — no gateway, no card details, ever.
              </p>
            </div>
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            {/* QR */}
            <div className="mx-auto rounded-2xl border border-line bg-white p-3">
              { }
              <img
                src="/images/site/upi-qr-placeholder.png"
                alt="UPI QR code — placeholder until the business UPI ID is configured"
                className="h-36 w-36 object-contain"
              />
            </div>
            <div>
              <p className={labelBase}>Pay via UPI</p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded-xl bg-cream px-4 py-2.5 text-[14px] font-semibold tracking-wide text-ink">
                  {upiId}
                </code>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sage px-4 py-2 text-[13px] font-semibold text-softwhite transition-colors hover:bg-sage-deep"
                >
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {copied ? "Copied!" : "Copy UPI ID"}
                </button>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-body">
                Send <b className="text-ink">{formatPrice(confirmed.total)}</b> to the UPI ID
                above (or scan the QR), then — optionally — share the transaction
                reference (UTR) below so we can match your payment faster.
                Bank-transfer details are available on request.
              </p>
            </div>
          </div>

          {/* Optional UTR */}
          <div className="mt-6 rounded-2xl bg-cream/70 p-5">
            <label htmlFor="utr" className={labelBase}>
              Payment reference (UTR) — optional
            </label>
            {utrSent ? (
              <p className="flex items-center gap-2 text-sm font-medium text-sage">
                <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={1.8} />
                Reference received — thank you!
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="utr"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 402183771234"
                  className={cn(inputBase, "flex-1")}
                  maxLength={40}
                />
                <button
                  type="button"
                  onClick={submitUtr}
                  disabled={utrBusy || utr.trim().length < 6}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-softwhite transition-colors hover:bg-inksoft disabled:opacity-40"
                >
                  {utrBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit reference"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-sage-soft/60 px-5 py-4 sm:flex-row">
            <p className="flex items-center gap-2 text-[13px] text-body">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-sage" strokeWidth={1.6} />
              Payment is verified manually before dispatch — we&apos;ll confirm over email.
            </p>
            <a
              href={whatsappLink(whatsappMessages.orderHelp(confirmed.orderId))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-whatsapp-deep"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              Get help on WhatsApp
            </a>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="text-sm font-semibold text-sage transition-colors hover:text-sage-deep"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Order form ─────────────────────────────────────────────────────── */

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[2rem] bg-softwhite p-7 soft-shadow sm:p-10"
      >
        <h2 className="font-serif text-2xl font-semibold text-ink">Your details</h2>
        <p className="mt-1 text-[13.5px] text-body">
          We only ask for what we need to hand-deliver your candles.
        </p>

        {serverError && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          >
            {serverError}
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className={labelBase}>Full name</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={set("fullName")}
              placeholder="e.g. Aisha Verma"
              autoComplete="name"
              className={inputBase}
            />
            <FieldError msg={fieldErrs["customer.fullName"]} />
          </div>

          <div>
            <label htmlFor="email" className={labelBase}>Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputBase}
            />
            <FieldError msg={fieldErrs["customer.email"]} />
          </div>

          <div>
            <label htmlFor="phone" className={labelBase}>Phone</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className={inputBase}
            />
            <FieldError msg={fieldErrs["customer.phone"]} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelBase}>Delivery address</label>
            <textarea
              id="address"
              value={form.address}
              onChange={set("address")}
              rows={3}
              placeholder="Flat / street, landmark, city, state, PIN / ZIP"
              autoComplete="street-address"
              className={cn(inputBase, "resize-none")}
            />
            <FieldError msg={fieldErrs["customer.address"]} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="note" className={labelBase}>
              Notes <span className="font-normal text-body">(optional)</span>
            </label>
            <textarea
              id="note"
              value={form.note}
              onChange={set("note")}
              rows={2}
              placeholder="Gift wrap, delivery preferences, anything else…"
              className={cn(inputBase, "resize-none")}
            />
            <FieldError msg={fieldErrs["note"]} />
          </div>

          {/* Honeypot — invisible to humans */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={set("company")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage px-7 py-4 text-[15px] font-semibold text-softwhite transition-colors duration-300 hover:bg-sage-deep disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Placing your order…
            </>
          ) : (
            "Place Order"
          )}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-body">
          <ShieldCheck className="h-3.5 w-3.5 text-sage" strokeWidth={1.6} />
          No payment now — you&apos;ll pay via UPI after we confirm your order.
        </p>
      </form>

      {/* Summary */}
      <aside className="rounded-[2rem] bg-softwhite p-7 soft-shadow lg:sticky lg:top-28">
        <h2 className="font-serif text-xl font-semibold text-ink">Your order</h2>

        <label htmlFor="product" className={cn(labelBase, "mt-5")}>
          Candle
        </label>
        <select
          id="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className={cn(inputBase, "appearance-none")}
        >
          {catalog.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatPrice(p.price)}
            </option>
          ))}
        </select>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-cream/70 p-3">
          {product && (
            <>
              { }
              <img
                src={product.image}
                alt=""
                className="h-16 w-16 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[15px] font-semibold text-ink">
                  {product.name}
                </p>
                <p className="truncate text-xs text-body">{product.fragrance}</p>
              </div>
              <div className="inline-flex items-center rounded-full border border-line bg-softwhite">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-sage-soft disabled:opacity-35"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-semibold text-ink tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-sage-soft"
                >
                  +
                </button>
              </div>
            </>
          )}
        </div>

        <dl className="mt-6 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-body">Item total</dt>
            <dd className="font-medium text-ink">{formatPrice(product ? product.price * qty : 0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-body">Delivery</dt>
            <dd className="font-medium text-sage">Free</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[15px]">
            <dt className="font-bold text-ink">Total</dt>
            <dd className="font-bold text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[13px] text-body">
          <li className="flex items-start gap-2.5">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.6} />
            Delivered in 7–14 days, tracked and packed with care.
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.6} />
            Payment verified manually — UPI or bank transfer after checkout.
          </li>
          <li className="flex items-start gap-2.5">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-sage" strokeWidth={1.6} />
            Questions? We reply on WhatsApp within a few hours.
          </li>
        </ul>
      </aside>
    </div>
  );
}
