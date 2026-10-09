import { NextResponse } from "next/server";
import { paymentNoteSchema, fieldErrors } from "@/lib/validation";
import { sendUtrUpdateEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/order/payment-note — attach an optional UTR to an order.
 *
 * v1 note: there is no order database yet, so the UTR is forwarded to the
 * business email for manual matching against the UPI statement. When Phase 2
 * (PostgreSQL) lands, this endpoint will persist the reference against the
 * order record instead.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`utr:${ip}`, 4, 60_000);
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

  const parsed = paymentNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the payment reference.", errors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  // Customer email is unknown without a store — the business can match from
  // the original order email; ask the customer for it is unnecessary friction.
  const sent = await sendUtrUpdateEmail(parsed.data.orderId, parsed.data.utr, "n/a");

  return NextResponse.json({ received: true, forwarded: sent }, { status: 200 });
}
