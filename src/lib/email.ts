import { formatPrice, siteConfig } from "@/lib/config";
import { formatDate } from "@/lib/order";
import type { ResolvedOrder } from "@/lib/order-data";

/**
 * Transactional email via Resend REST API.
 *
 * - The RESEND_API_KEY lives ONLY in server environment variables and is never
 *   shipped to the client or committed to git.
 * - Emails are sent with plain fetch (no SDK) so the code stays portable to
 *   Cloudflare Workers later.
 * - If no API key is configured (local dev), the payload is logged instead and
 *   delivery is skipped gracefully — the order flow must never break.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = process.env.EMAIL_FROM ?? "Ignite Wax <onboarding@resend.dev>";

export type EmailStatus = "sent" | "not-configured" | "failed";

export interface SendOutcome {
  sent: boolean;
  status: EmailStatus;
  /** Short, safe-to-display reason when the email was not delivered. */
  reason?: string;
}

/** Extract a human-readable reason from a Resend error response body. */
function reasonFromResendError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string };
    if (parsed.message) return parsed.message.slice(0, 160);
  } catch {
    /* fall through to status-based hints */
  }
  if (status === 401 || status === 403)
    return "Email provider rejected the request — check RESEND_API_KEY and verify your sending domain in Resend.";
  if (status === 422) return "Email provider rejected the message content or address.";
  if (status === 429) return "Email provider rate limit hit — try again shortly.";
  return `Email provider error (HTTP ${status}).`;
}

async function sendEmail(
  subject: string,
  html: string,
  to: string,
  replyTo?: string,
): Promise<SendOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(
      `[email:dev] RESEND_API_KEY not set — skipping delivery.\n` +
        `[email:dev] to=${to} subject="${subject}"\n` +
        `[email:dev] html=${html.slice(0, 400)}...`,
    );
    return { sent: false, status: "not-configured", reason: "Email sending is not configured (RESEND_API_KEY missing)." };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Resend error ${res.status}: ${body.slice(0, 300)}`);
      return {
        sent: false,
        status: "failed",
        reason: reasonFromResendError(res.status, body),
      };
    }
    return { sent: true, status: "sent" };
  } catch (err) {
    console.error("[email] failed to send:", err instanceof Error ? err.message : err);
    return { sent: false, status: "failed", reason: "Could not reach the email provider." };
  }
}

/* ── Shared styling ─────────────────────────────────────────────────────── */

const WRAP_OPEN = `
<div style="font-family:Helvetica,Arial,sans-serif;background:#faf6ef;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #eae1d1;">
    <div style="background:#33493a;padding:24px 32px;">
      <span style="color:#fdfbf7;font-size:20px;font-weight:700;letter-spacing:0.02em;">Ignite Wax</span>
      <span style="color:#e89b77;font-size:13px;margin-left:10px;">Handmade with intention</span>
    </div>
    <div style="padding:32px;color:#33493a;line-height:1.65;font-size:15px;">`;

const WRAP_CLOSE = `
    </div>
    <div style="padding:20px 32px;background:#f3ecdf;color:#7d8677;font-size:12px;">
      Ignite Wax · Premium hand-poured soy candles · Estimated delivery in 7–14 days
    </div>
  </div>
</div>`;

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#7d8677;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0 6px 18px;color:#33493a;font-size:14px;">${value}</td>
  </tr>`;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── Business notification ──────────────────────────────────────────────── */

export async function sendBusinessEmail(order: ResolvedOrder): Promise<boolean> {
  const itemRows = order.items
    .map(
      (i) =>
        `<li style="margin-bottom:6px;"><b>${esc(i.name)}</b> (${esc(i.id)}) — ${i.quantity} × ${formatPrice(i.price)} = <b>${formatPrice(i.lineTotal)}</b></li>`,
    )
    .join("");

  const html = `${WRAP_OPEN}
    <h2 style="margin:0 0 4px;font-size:18px;">New order received</h2>
    <p style="margin:0 0 18px;color:#7d8677;">Order ${esc(order.orderId)} · ${esc(order.orderDateLabel)}</p>
    <table style="border-collapse:collapse;">
      ${row("Order ID", `<b>${esc(order.orderId)}</b>`)}
      ${row("Order date", esc(order.orderDateLabel))}
      ${row("Customer", esc(order.customer.fullName))}
      ${row("Phone", esc(order.customer.phone))}
      ${row("Email", esc(order.customer.email))}
      ${row(
        "Address",
        esc(order.customer.address) +
          (order.customer.city || order.customer.state || order.customer.pincode
            ? "<br/>" +
              esc([order.customer.city, order.customer.state].filter(Boolean).join(", ")) +
              (order.customer.pincode ? " — " + esc(order.customer.pincode) : "")
            : ""),
      )}
      ${row("Items", `<ul style="margin:0;padding-left:18px;">${itemRows}</ul>`)}
      ${row("Order total", `<b style="font-size:16px;">${formatPrice(order.total)}</b>`)}
      ${row("Estimated delivery", `<b>${esc(order.deliveryLabel)}</b>`)}
      ${order.customerNote ? row("Customer note", esc(order.customerNote)) : ""}
      ${order.paymentReference ? row("Payment ref (UTR)", esc(order.paymentReference)) : row("Payment", "Awaiting UPI payment / manual verification")}
    </table>
  ${WRAP_CLOSE}`;

  return sendEmail(
    `New order ${order.orderId} — ${formatPrice(order.total)} — ${esc(order.customer.fullName)}`,
    html,
    siteConfig.businessEmail,
  ).then((r) => r.sent);
}

/* ── Customer acknowledgement ───────────────────────────────────────────── */

export async function sendCustomerEmail(order: ResolvedOrder): Promise<SendOutcome> {
  const itemRows = order.items
    .map(
      (i) =>
        `<li style="margin-bottom:6px;"><b>${esc(i.name)}</b> — ${i.quantity} × ${formatPrice(i.price)}</li>`,
    )
    .join("");

  const html = `${WRAP_OPEN}
    <p style="margin:0 0 4px;color:#d97b4f;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Order received</p>
    <h2 style="margin:0 0 14px;font-size:22px;">Thank you, ${esc(order.customer.fullName.split(" ")[0])}.</h2>
    <p>Your order has been received and is being prepared with care. Our team will confirm your payment manually over WhatsApp or email once it is verified.</p>
    <table style="border-collapse:collapse;margin:18px 0;">
      ${row("Order ID", `<b>${esc(order.orderId)}</b>`)}
      ${row("Order date", esc(order.orderDateLabel))}
      ${row("Items", `<ul style="margin:0;padding-left:18px;">${itemRows}</ul>`)}
      ${row("Total", `<b style="font-size:16px;">${formatPrice(order.total)}</b>`)}
      ${row("Estimated delivery", `<b>${esc(order.deliveryLabel)}</b>`)}
    </table>
    <div style="background:#fbeadd;border-radius:12px;padding:14px 18px;margin:0 0 18px;font-size:14px;">
      <b>Next step — payment:</b> if you haven't completed the UPI payment yet, please check the payment section on the website or reply to this email and we'll help you out. Payment is verified manually before dispatch.
    </div>
    <p style="margin:0 0 6px;">Need help? Chat with us on WhatsApp — we usually reply within a few hours.</p>
    <p style="margin:0;color:#7d8677;font-size:13px;">Warmly,<br/>Team Ignite Wax</p>
  ${WRAP_CLOSE}`;

  return sendEmail(
    `Your Ignite Wax order ${order.orderId} — estimated delivery ${order.deliveryLabel}`,
    html,
    order.customer.email,
    siteConfig.businessEmail,
  );
}

/** UTR update notification for the business. */
export async function sendUtrUpdateEmail(
  orderId: string,
  utr: string,
  customerEmail: string,
): Promise<boolean> {
  const html = `${WRAP_OPEN}
    <h2 style="margin:0 0 4px;font-size:18px;">Payment reference received</h2>
    <p style="margin:0 0 18px;color:#7d8677;">for order ${esc(orderId)}</p>
    <table style="border-collapse:collapse;">
      ${row("Order ID", `<b>${esc(orderId)}</b>`)}
      ${row("UTR", `<b>${esc(utr)}</b>`)}
      ${row("Customer email", esc(customerEmail))}
      ${row("Date", esc(formatDate(new Date())))}
    </table>
    <p style="margin:18px 0 0;color:#7d8677;font-size:13px;">Match this UTR with your UPI statement, then mark the order as paid.</p>
  ${WRAP_CLOSE}`;

  return sendEmail(`Payment ref for ${orderId} — UTR ${utr}`, html, siteConfig.businessEmail).then(
    (r) => r.sent,
  );
}

/* ── Contact form ───────────────────────────────────────────────────────── */

/** Contact enquiry notification for the business. */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const html = `${WRAP_OPEN}
    <h2 style="margin:0 0 4px;font-size:18px;">New contact enquiry</h2>
    <p style="margin:0 0 18px;color:#7d8677;">from the website contact form</p>
    <table style="border-collapse:collapse;">
      ${row("Name", `<b>${esc(input.name)}</b>`)}
      ${row("Email", esc(input.email))}
      ${input.subject ? row("Subject", esc(input.subject)) : ""}
      ${row("Message", esc(input.message).replace(/\n/g, "<br/>"))}
      ${row("Date", esc(formatDate(new Date())))}
    </table>
    <p style="margin:18px 0 0;color:#7d8677;font-size:13px;">Reply directly to this email to answer the customer.</p>
  ${WRAP_CLOSE}`;

  return sendEmail(
    `Website enquiry — ${esc(input.name)}${input.subject ? ` — ${esc(input.subject)}` : ""}`,
    html,
    siteConfig.contactEmail,
    input.email,
  ).then((r) => r.sent);
}
