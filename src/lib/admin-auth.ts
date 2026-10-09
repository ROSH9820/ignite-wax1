/**
 * Phase 1 admin gate — shared constants + server-side check.
 *
 * A simple shared password (ADMIN_PASSWORD env, documented default) sets an
 * httpOnly cookie. Phase 2 replaces this with NextAuth + PostgreSQL; the
 * call-sites (layout check, login/logout routes) stay unchanged.
 */

import { cookies } from "next/headers";

export const ADMIN_COOKIE = "iw_admin";
export const ADMIN_COOKIE_VALUE = "granted-phase-1";
export const ADMIN_DEFAULT_PASSWORD = "ignite2026";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}
