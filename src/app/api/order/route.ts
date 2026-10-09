import { NextResponse } from "next/server";
import { orderFormSchema, fieldErrors } from "@/lib/validation";
import { resolveItems } from "@/lib/order-data";
import { generateOrderId, estimateDelivery, formatDate } from "@/lib/order";
import { sendBusinessEmail, sendCustomerEmail } from "@/lib/email";
import { clientIp, rateLimit, verifyTurnstile } from "@/lib/rate-limit";

/**
 * POST /api/order — place an order.
 *
 * Security model:
 * - All validation happens here (zod) — never trust the browser.
 * - Prices and product details come ONLY from the trusted catalog.
 * - Order IDs and delivery windows are generated server-side.
 * - Rate limiting (5/min/IP), honeypot field, optional Turnstile.
 * - Raw errors never reach the client.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);

  // 1. Anti-spam: rate limit first (cheap), then Turnstile if configured.
  const rl = rateLimit(`order:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // 2. Validate shape.
  const parsed = orderFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // 3. Honeypot — bots that filled it get a fake-success and stop here.
  if (input.company && input.company.length > 0) {
    return NextResponse.json({ orderId: "IW-0000-00000", deliveryLabel: "", items: [], total: 0 });
  }

  // 4. Optional Turnstile verification.
  const turnstileToken = req.headers.get("x-turnstile-token") ?? undefined;
  const human = await verifyTurnstile(turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { message: "Verification failed. Please refresh and try again." },
      { status: 400 },
    );
  }

  // 5. Resolve products + prices from the trusted catalog.
  const resolved = resolveItems(input.items);
  if (!resolved) {
    return NextResponse.json(
      { message: "One of the selected products is unavailable. Please review your order." },
      { status: 400 },
    );
  }

  // 6. Server-side order identity + delivery estimate.
  const now = new Date();
  const orderId = await generateOrderId(now);
  const delivery = estimateDelivery(now);

  const order = {
    orderId,
    orderDateLabel: formatDate(now),
    deliveryLabel: delivery.label,
    customer: input.customer,
    items: resolved.items,
    total: resolved.total,
    customerNote: input.note || undefined,
  };

  // 7. Emails — a failure is logged but never blocks the order.
  const [businessSent, customer] = await Promise.all([
    sendBusinessEmail(order),
    sendCustomerEmail(order),
  ]);

  return NextResponse.json(
    {
      orderId: order.orderId,
      deliveryLabel: order.deliveryLabel,
      items: order.items,
      total: order.total,
      emailsSent: {
        business: businessSent,
        customer: customer.sent,
        customerStatus: customer.status,
        ...(customer.reason ? { customerReason: customer.reason } : {}),
      },
    },
    { status: 201 },
  );
}
