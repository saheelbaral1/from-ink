# CLAUDE.md

Guidance for working in this repository. Read this before making changes. For the "what is it / how do I run it" overview, see [README.md](./README.md).

## What this is

**From.ink** — a web app that turns a child's drawing into a watercolour storybook illustration and sells it as a printed poster. Next.js 16 (App Router) + TypeScript + Tailwind v4, deployed on Vercel at **from.ink**. Pipeline: upload → Gemini → Supabase → Stripe → Gelato. See README for the full flow and file-by-file breakdown.

## ⚠️ Brand & design constraints (read before touching any UI)

The brand is a **premium memory-keepsake / children's-book-publisher** — about preserving a fleeting childhood moment. It is **NOT** "AI image transformation" and **NOT** a tech/SaaS product. This positioning is deliberate and locked.

**Hard rules — do not violate without explicit sign-off:**
- The theme is **light** ("warm paper") and locked. A dark/"gallery" theme was considered and explicitly rejected. Do not propose dark.
- **No gradients, no glowing/AI effects, no glassmorphism/floating glass cards, no spinning loaders.**
- Warm, editorial, generous whitespace. Motion is **subtle and calm**, never flashy or SaaS-bouncy.
- Reuse the existing palette and type tokens — don't introduce new colours or fonts.

### Design system (`src/app/globals.css`)
- **Palette tokens** (`@theme`): `--color-paper #f7f4ee`, `--color-ink #1c1c1c`, `--color-navy #48546a` (subheads/CTAs), `--color-sage #7b8b78` (italic emphasis), `--color-terracotta #c98b72` (small accents). Plus `--shadow-paper`.
- **Fonts** (`next/font` in `layout.tsx`): Cormorant Garamond = `font-display` (headlines, incl. italic); Inter = `font-body`; Caveat = `font-hand` (handwritten captions only).
- **Motion vocabulary** (keyframes in `globals.css`): `fadeInUp` (section reveals + wizard stage transitions), `breathe` (wizard "generating" blob), `grainDrift` (ambient ~34s paper-grain drift), `burst` (success celebration). Reuse these rather than inventing new ones. Every animation must respect `prefers-reduced-motion` — there's a single guard at the bottom of `globals.css` (`[style*="..."]` selectors + `.reveal-init`); extend it when adding motion.
- Recurring motifs: white photo "mount" (`bg-white p-2 shadow-paper` + slight rotation), watercolour before/after pairs, hand-script section labels in terracotta.

## Architecture notes

- **Server components by default.** Client components (`"use client"`) are only: `UploadWizard`, `HeroCarousel`, `Reveal`, `Burst`. Keep interactivity in these; everything else is static/server-rendered.
- **`page.tsx`** composes: `Hero` → `UploadWizard` (in a `#upload-tool` section, the scroll anchor for CTAs) → `DrawerMoment` → `Faq`. `Reveal` wraps the upload section and `DrawerMoment`; `Faq` reveals its rows internally with a stagger.
- **No external motion/carousel libs** — the before/after slider and particle burst are hand-rolled (Pointer Events + `clip-path`; deterministic seeded scatter). If a lint rule complains about `Math.random` during render or `setState` in an effect body, that's intentional React strictness — use deterministic values / deferred state, don't add a lib.
- **Watermarking** (`UploadWizard` preview) is a CSS overlay over a `background-image` div, not a modification of the actual file — deters casual right-click-save only, not real DRM.
- **`/api/capture-email` must never block checkout** — it's best-effort; keep it returning `{ ok: true }` even on failure.

## Conventions

- Verify before declaring done: `npx tsc --noEmit`, `npm run build`, and `npx eslint <changed files>`. The repo uses Next 16's strict React lint rules (purity, no-setState-in-effect) — expect them.
- Match surrounding Tailwind idioms; keep the shared navy CTA pill style in sync where it's repeated.
- Commit completed, verified work in clear, feature-scoped commits (no need to ask). End commit messages with the `Co-Authored-By` trailer. The repo has no global git identity configured — commits derive `Saheel Baral <saheelbaral@Saheels-MacBook-Air.local>`.
- Avoid `cd <dir> && <write command>` Bash compounds — they trip a permission guard. Use absolute paths instead.

## ⚠️ Deploy workflow (critical)

- **Vercel Git integration is connected: pushing to `main` auto-deploys to production (from.ink).** A push *is* a deploy. `vercel --prod` from the CLI is retired so `main` stays the single source of truth.
- **Standing process:** make changes → verify on `localhost:3000` → the owner reviews on localhost → **only when explicitly told "push this live" / "deploy"**, commit and push to `main`. Local commits may be held; the *push* is the gate. After pushing, verify production directly (e.g. `curl https://www.from.ink`, confirm the expected copy/markers).
- **Exception:** small changes the owner says should "just go live" (typos, pre-approved copy) can go straight to `main`.
- **Env var changes need a redeploy** to take effect in production — serverless functions don't hot-reload env. Locally, restart the dev server after editing `.env.local`.

## Gotchas

- **`.env.local` must have the leading dot.** It was once misnamed `env.local`, so Next.js silently didn't load it and every API route failed ("… not configured"). Env loads only at process start.
- **Image assets:** served copies live in `public/images/` with kebab-case names (`dragon-knight-{before.png,after.jpeg}`, `house-…`, `unicorn-…`, `rocket-…`, plus scene shots). A redundant root `images/` folder (original space/`+` filenames) is **gitignored** — only `public/images/` is served.
- **Gemini output is 4:5 portrait** (`928×1152`); the original "before" photos are landscape (`1408×768`). When both share a frame with `object-cover`, the landscape photos crop — spot-check.
- **Supabase `email_captures` table** must exist (see README for the SQL); the route degrades gracefully if it doesn't, but captures won't persist.
- **Stripe is live mode** — testing a full payment charges a real card.
