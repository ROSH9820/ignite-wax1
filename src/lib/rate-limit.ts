/**
 * Lightweight in-memory rate limiter (sliding window).
 *
 * Free-tier friendly: no external service needed. Per-server-instance state is
 * acceptable for low-volume protection on a single Cloudflare/Node instance.
 * For strict global limits later, swap the Map for Upstash/Redis in Phase 2 —
 * call-sites stay unchanged.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

/** Returns true when the action is allowed. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Prevent unbounded growth under attack.
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) {
      if (b.timestamps.every((t) => now - t > windowMs)) buckets.delete(k);
      if (buckets.size <= MAX_KEYS) break;
    }
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers (Cloudflare / nginx aware). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Optional Cloudflare Turnstile verification.
 * Enabled only when TURNSTILE_SECRET_KEY is set — keeps local dev frictionless
 * while giving production spam protection for free.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
