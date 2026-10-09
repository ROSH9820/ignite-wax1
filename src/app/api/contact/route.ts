import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/contact — receive a contact-form enquiry.
 *
 * Same trust model as /api/order: server-side zod validation, rate limiting,
 * honeypot, and email delivery via Resend. If no API key is configured the
 * payload is logged and success is still returned so the form never breaks.
 */

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address.").max(120),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please write a short message.").max(2000),
  /** Honeypot — must stay empty. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`contact:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const input = parsed.data;

  // Honeypot filled → pretend success, do nothing.
  if (input.company && input.company.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const sent = await sendContactEmail({
    name: input.name,
    email: input.email,
    subject: input.subject || undefined,
    message: input.message,
  });

  return NextResponse.json({ ok: true, forwarded: sent }, { status: 201 });
}
