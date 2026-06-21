# From.ink

Turn a child's drawing into a watercolour storybook illustration, then print and ship it as a poster.

A parent photographs their kid's drawing → it's transformed into a polished watercolour illustration by AI → they preview it (watermarked) → pay → it's printed on demand and shipped to their door. Live at **[from.ink](https://www.from.ink)**.

The brand is a **premium memory-keepsake / children's-book-publisher**, not an "AI image tool." See [CLAUDE.md](./CLAUDE.md) for the (strict) design constraints before touching any UI.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens in `globals.css`), `next/font` |
| Image generation | Google Gemini (`gemini-3.1-flash-image`) via the Generative Language REST API |
| Storage | Supabase (public Storage bucket + one Postgres table) |
| Payments | Stripe Checkout (hosted), **live mode**, €39 EUR |
| Fulfilment | Gelato print-on-demand (routes each order to the nearest facility) |
| Hosting | Vercel (Git integration — push to `main` auto-deploys production) |
| Runtime | Node.js 24 |

Runtime dependencies are intentionally minimal: `@google/genai`, `@supabase/supabase-js`, `stripe`, `lucide-react`, `next`, `react`. No CSS/animation/carousel libraries — all motion is hand-rolled CSS keyframes + a little React.

---

## End-to-end flow

```
Parent uploads drawing
   │  (UploadWizard — stage 1)
   ▼
POST /api/generate  ──►  Gemini gemini-3.1-flash-image (4:5 watercolour)
   │                         │
   │                         ▼
   │                    upload to Supabase Storage bucket "generated-images" (public)
   ◄─────────────────── { storageUrl }
   ▼
Preview (stage 2): watermarked result via CSS overlay, up to 3 free retries
   ▼
Order (stage 3): email → POST /api/capture-email (best-effort → Supabase "email_captures")
   ▼
POST /api/checkout  ──►  Stripe Checkout Session (€39 EUR, collects shipping) ──► redirect to Stripe hosted page
   ▼
payment completes
   ▼
Stripe fires checkout.session.completed
   ▼
POST /api/webhooks/stripe  ──►  verify signature ──►  create Gelato order (v4/orders) with image + shipping address
   ▼
/success  (customer lands here; Gelato prints & ships)
```

### API routes (`src/app/api/`)
- **`generate/route.ts`** — accepts a multipart image, calls Gemini `generateContent` with `responseModalities: ["IMAGE","TEXT"]` and `imageConfig.aspectRatio: "4:5"`, uploads the result to Supabase Storage (creating the bucket if missing), returns `{ storageUrl }`. `maxDuration = 120`.
- **`checkout/route.ts`** — creates a Stripe Checkout Session: `unit_amount: 3900` EUR, `shipping_address_collection` for a fixed country list, `metadata.imageUrl` (used later by the webhook), success/cancel URLs. Returns `{ url }` for client redirect.
- **`webhooks/stripe/route.ts`** — verifies the Stripe signature (raw body), and on `checkout.session.completed` reads shipping from `session.collected_information.shipping_details` (Stripe v22 location) and POSTs a Gelato order to `https://order.gelatoapis.com/v4/orders` (`X-API-KEY`). Degrades gracefully (logs, returns 200) if Gelato env is missing.
- **`capture-email/route.ts`** — best-effort insert of `{ email, image_url }` into Supabase `email_captures`. **Never blocks checkout**: if the table is missing or insert fails, it logs and still returns `{ ok: true }`.

### Frontend (`src/app/page.tsx` composes these)
- **`Hero.tsx`** — announcement bar, nav, headline, CTAs, social proof; renders `HeroCarousel`; ends in a torn-paper edge.
- **`HeroCarousel.tsx`** (client) — draggable before/after comparison slider (`clip-path`, Pointer Events), dots + prev/next arrows to switch the 4 example pairs, and a one-time first-load "nudge" hint.
- **`UploadWizard.tsx`** (client) — the 3-stage conversion flow (upload → generating → preview → order). Staged "generating" narrative (no spinner), watermark overlay, retry counter, email capture, Stripe redirect. Renders `Burst` on success.
- **`Burst.tsx`** (client) — decorative brand-palette particle burst fired when a keepsake finishes generating.
- **`DrawerMoment.tsx`**, **`Faq.tsx`** — storytelling section + accordion FAQ.
- **`Reveal.tsx`** (client) — IntersectionObserver wrapper that fades sections up on first scroll-into-view.

---

## Environment variables

Local dev reads `.env.local` (note the leading dot — Next.js only auto-loads dotfiles). Production reads Vercel project env vars. All of these are referenced in code:

| Var | Used by | Notes |
|---|---|---|
| `GEMINI_API_KEY` | `/api/generate` | Google Generative Language API key |
| `SUPABASE_URL` | `src/lib/supabase.ts` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabase.ts` | **Service role** key (server-only, never expose) |
| `STRIPE_SECRET_KEY` | `/api/checkout`, `/api/webhooks/stripe` | Live secret key (`sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | `/api/webhooks/stripe` | `whsec_…` for signature verification |
| `GELATO_API_KEY` | `/api/webhooks/stripe` | Gelato API key |
| `GELATO_PRODUCT_UID` | `/api/webhooks/stripe` | Gelato product UID (the poster SKU) |
| `NEXT_PUBLIC_SITE_URL` | `/api/checkout` | Origin for Stripe success/cancel URLs (falls back to the request origin) |

> ⚠️ **Env vars only load at process start.** After changing `.env.local`, restart the dev server. After changing a Vercel env var, you must **redeploy** — existing serverless functions don't hot-reload env.

### Supabase setup
- **Storage bucket `generated-images`** — public; auto-created by `/api/generate` on first run.
- **Table `email_captures`** — must be created manually (the JS client can't run DDL):
  ```sql
  create table if not exists public.email_captures (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    image_url text,
    created_at timestamptz not null default now()
  );
  alter table public.email_captures enable row level security;
  ```

---

## Local development

```bash
npm install
# create .env.local with the variables above (leading dot is required)
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`. Type-check with `npx tsc --noEmit`.

---

## Deployment

Production is **Vercel with Git integration**: pushing to `main` automatically deploys to production (from.ink). There is no separate manual deploy step — `git push origin main` *is* the deploy. (The CLI `vercel --prod` path is deliberately retired so `main` stays the single source of truth.)

To apply a changed Vercel env var without code changes, trigger a fresh deployment (Dashboard → Deployments → Redeploy, or push a commit).

---

## Known gaps / TODO

- **`/success` page is unstyled** — still default Tailwind (stone/amber/emoji), off-brand vs. the rest of the site.
- **No mobile nav** — the header "menu" button has no handler / drawer.
- **Single product, single style** — one fixed Gemini watercolour style; one €39 poster (40×50 cm).
- **Stripe is in live mode** — there is no test-mode toggle wired up; real checkouts charge real cards.
- **Celebratory `Burst`** is built and wired into `UploadWizard` but may be pending review before a production deploy — check `git log` / the live site to confirm what's shipped.
