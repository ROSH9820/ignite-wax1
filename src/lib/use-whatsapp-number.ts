"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";

/**
 * WhatsApp number that always reflects the CURRENT dashboard configuration.
 *
 * `siteConfig.whatsappNumber` inside a client component is the value inlined
 * at the last BUILD. If the business updates
 * NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER in the Cloudflare dashboard afterwards
 * (runtime binding), the built bundle never sees it — this hook fetches the
 * live value from /api/site-config (server runtime env) once per session and
 * falls back to the build-time value on any failure.
 */

let cached: string | null = null;
let inflight: Promise<string> | null = null;

function fetchRuntimeNumber(): Promise<string> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = fetch("/api/site-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const n: unknown = data?.whatsappNumber;
        if (typeof n === "string" && /^\d{8,15}$/.test(n)) {
          cached = n;
          return n;
        }
        return siteConfig.whatsappNumber;
      })
      .catch(() => siteConfig.whatsappNumber);
  }
  return inflight;
}

export function useWhatsAppNumber(): string {
  const [number, setNumber] = useState(siteConfig.whatsappNumber);

  useEffect(() => {
    let alive = true;
    fetchRuntimeNumber().then((n) => {
      if (alive) setNumber((current) => (current === n ? current : n));
    });
    return () => {
      alive = false;
    };
  }, []);

  return number;
}
