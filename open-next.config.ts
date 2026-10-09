import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext → Cloudflare adapter config.
 *
 * Minimal setup: the site is a static-marketing + API-routes app with no ISR,
 * so the default in-worker cache is enough (no R2/KV bindings needed).
 * See https://opennext.js.org/cloudflare
 */
export default defineCloudflareConfig();
