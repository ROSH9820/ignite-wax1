import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

/**
 * GET /api/site-config — public runtime configuration for client components.
 *
 * NEXT_PUBLIC_* vars are inlined into the client bundle at BUILD time, so a
 * value added to the Cloudflare dashboard after the last deploy is invisible
 * to the browser. This endpoint serves the number from SERVER runtime env
 * (which always reflects the dashboard), letting clients self-correct.
 * Nothing here is sensitive — the WhatsApp number is public by design.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { whatsappNumber: siteConfig.whatsappNumber },
    { headers: { "Cache-Control": "no-store" } },
  );
}
