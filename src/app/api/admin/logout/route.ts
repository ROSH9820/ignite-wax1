import { NextResponse } from "next/server";

/** POST /api/admin/logout — clears the Phase 1 admin session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("iw_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
