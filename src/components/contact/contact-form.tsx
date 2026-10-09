"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-2xl border border-input bg-softwhite px-4 py-3 text-[14.5px] text-ink placeholder:text-body/45 transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";
const labelBase = "mb-1.5 block text-[13px] font-bold text-ink";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({});

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrs({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSent(true);
        return;
      }
      if (data?.errors) setFieldErrs(data.errors);
      setError(data?.message ?? "Something went wrong — please try again.");
    } catch {
      setError("We couldn't reach the server. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[2rem] bg-softwhite p-10 text-center soft-shadow">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft">
          <CheckCircle2 className="h-7 w-7 text-sage" strokeWidth={1.6} />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">Message sent</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-body">
          Thank you for reaching out — we usually reply within one business day,
          often much sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] bg-softwhite p-7 soft-shadow sm:p-10">
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelBase}>Name</label>
          <input id="contact-name" value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your name" className={inputBase} />
          <FieldError msg={fieldErrs.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelBase}>Email</label>
          <input id="contact-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" className={inputBase} />
          <FieldError msg={fieldErrs.email} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-subject" className={labelBase}>
            Subject <span className="font-normal text-body">(optional)</span>
          </label>
          <input id="contact-subject" value={form.subject} onChange={set("subject")} placeholder="Order help, wholesale, press…" className={inputBase} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelBase}>Message</label>
          <textarea id="contact-message" value={form.message} onChange={set("message")} rows={5} placeholder="How can we help?" className={cn(inputBase, "resize-none")} />
          <FieldError msg={fieldErrs.message} />
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" tabIndex={-1} autoComplete="off" value={form.company} onChange={set("company")} />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage px-7 py-4 text-[15px] font-semibold text-softwhite transition-colors duration-300 hover:bg-sage-deep disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4.5 w-4.5" strokeWidth={1.8} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{msg}</p>;
}
