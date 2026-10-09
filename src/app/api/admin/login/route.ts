import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE, ADMIN_DEFAULT_PASSWORD } from "@/lib/admin-auth";

/**
 * POST /api/admin/login — Phase 1 admin gate.
 *
 * Compares against a simple shared password (ADMIN_PASSWORD env var, with a
 * documented default) and sets an httpOnly session cookie. This is
 * intentionally lightweight for Phase 1 — Phase 2 replaces it with real
 * auth (NextAuth) backed by PostgreSQL.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD ?? ADMIN_DEFAULT_PASSWORD;
  const provided = typeof body.password === "string" ? body.password : "";

  if (provided !== expected) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

/** GET — allows the layout to learn whether the current cookie is valid. */
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]*)`));
  return NextResponse.json({ authed: match?.[1] === ADMIN_COOKIE_VALUE });
}
