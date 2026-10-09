# Deploying Ignite Wax to Cloudflare

This project runs on **Cloudflare Workers** (not classic Pages) via the official
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter.

> ⚠️ A Worker created from the "Hello World" template will only show
> "Hello World!" — it never runs this repo. Follow the steps below instead.

## Stack

| Piece | File | Purpose |
|---|---|---|
| Adapter config | `open-next.config.ts` | Minimal OpenNext setup (no ISR cache needed) |
| Worker config | `wrangler.jsonc` | Entry `.open-next/worker.js`, `nodejs_compat`, static assets |
| Build scripts | `package.json` | `cf:build` / `cf:preview` / `cf:deploy` |

## One-time local sanity check

```bash
npm install
npm run cf:build     # builds .open-next/ (Next build + worker bundle)
npm run cf:preview   # serves the real worker on http://localhost:8787
```

## Connect the GitHub repo (Workers Builds)

1. Dash → **Workers & Pages** → **Create** → **Workers** → **Import a repository**
   (do NOT pick "Hello World").
2. Select `ROSH9820/IgniteWax`, branch `main`.
3. Build settings (auto-detected from `wrangler.jsonc`; verify):
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
4. **Build variables** (Settings → Build → Variables and Segments):
   - `NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER` = e.g. `919999999999`
     *(digits only, no `+`/spaces — this is inlined into the client bundle at
     BUILD time, so it must be a build variable)*
5. Deploy. Every push to `main` now redeploys automatically.

## Runtime variables & secrets

Worker → Settings → **Variables and Secrets** (or `wrangler secret put <NAME>`):

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | for live order/contact emails | server-only secret |
| `ADMIN_PASSWORD` | recommended | admin dashboard gate (has a documented default otherwise) |
| `EMAIL_FROM` | optional | e.g. `Ignite Wax <orders@yourdomain.com>` |
| `TURNSTILE_SECRET_KEY` | optional | enables CAPTCHA verification on /api/order |

Do **not** put secrets in `wrangler.jsonc` — that file is committed to git.

## Version pins that matter

- `next` is pinned to **16.3.8** (exact, no caret). Do not jump to 16.4.x yet —
  16.4 introduced a new `preview-props.json` server manifest that
  `@opennextjs/cloudflare@1.20.9` does not inline, which crashes the worker at
  runtime (`Unexpected loadManifest(...preview-props.json) call!`).
- **`bun.lock` is committed for Cloudflare CI.** Workers Builds installs
  dependencies with `bun install --frozen-lockfile` (it ignores
  `package-lock.json`), so a missing/stale bun.lock fails the build with
  "lockfile had changes, but lockfile is frozen". After ANY dependency change:
  1. `npm install` (updates package-lock.json, what local/sandbox dev uses)
  2. `bunx bun@1.2.15 install` (regenerates bun.lock — pin the same bun
     version Cloudflare's image runs) and commit BOTH lockfiles.
- `.node-version` pins CI to Node 22.
- When a newer adapter release explicitly supports Next ≥ 16.4, bump `next`
  and the adapter together and re-run `npm run cf:build` + smoke test.
