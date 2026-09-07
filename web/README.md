# Nova Pulse — web

Next.js 16 (App Router) port of the legacy single-file `index.html` marketing site.
Phase 1 of the migration: same design, real build pipeline, no backend yet.

## Run it

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_URL and AUTH_SECRET
npm run db:migrate                # apply the schema
npm run db:seed-admin             # create your first admin login
npm run dev                       # http://localhost:3000
```

| Command | Does |
| --- | --- |
| `npm run dev` / `build` / `start` | the app |
| `npm test` | Vitest suite (needs a Postgres it can truncate) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | write a new migration from schema changes |
| `npm run db:migrate` | apply pending migrations |
| `npm run db:studio` | browse the data |
| `npm run db:seed-admin` | create or update an admin user |

## Illustrations

`components/illustrations/` holds original SVG scenes drawn in the brand palette —
attendance flow, payroll flow, security, hiring, growth. They are **not stock photos
and not scraped images**: those would be someone else's copyright on a commercial
site. These are owned outright, weigh a few KB each, stay sharp at any size, and
animate.

Motion inside them uses CSS (`offset-path`, keyframes), never SMIL — SMIL cannot be
switched off by `prefers-reduced-motion`, so a `<animateMotion>` would keep moving for
someone who asked it not to. Every keyframe lives in `globals.css` under a
`prefers-reduced-motion: no-preference` guard, so the scenes degrade to static artwork.

Content files pick a scene by name through the registry in
`components/illustrations/index.tsx`, the same pattern as the icon registry.
**Ten scenes, each used exactly once** — five for services, five for industries.
If you add a page, draw it a new scene rather than reusing one; a repeated
illustration reads as filler.

Each scene namespaces its gradient ids (`fac-violet`, `cli-violet`, …). SVG ids are
document-global, so without that two scenes on one page would both define
`np-violet` and the second would silently inherit the first's colours.

## Interactive pieces

- `components/tools/payroll-savings.tsx` — the estimator on `/services/hrms-payroll`.
  It models **effort in hours, not money saved**, and prints its assumptions on screen,
  because a rupee "ROI" figure would be a number we cannot stand behind.
- `components/ui/accordion.tsx` — button + `aria-expanded` rather than `<details>`, so
  only one panel opens and the state is announced.
- `components/ui/reading-progress.tsx`, `back-to-top.tsx` — long-page navigation.
- Blog tags are real filters (`/blog?tag=…`), server-rendered, with an empty state.
- `.np-range` in `globals.css` gives the sliders a 28px hit area while keeping the
  visible track thin; a bare `input[type=range]` is ~8px and fails touch guidelines.

## Content and motion

**Pages** are content-driven wherever there is a set of them. `content/services.ts`
(5 services), `content/industries.ts` (5 sectors), `content/company.ts` (values,
credentials, locations, leadership, roles) and `content/clients.ts` each drive their
pages plus the nav, footer, sitemap and JSON-LD. Adding a sixth service or sector is
adding an object, not building a page.

Two arrays in `content/company.ts` are **deliberately empty**: `leadership` and
`openRoles`. The original site never named anyone and had no advertised vacancies, so
populating them would mean inventing facts about real people and real jobs. Both
sections hide themselves until you fill them in.

**Services** live in `content/services.ts` as typed data — one file drives the five
service pages, the header dropdown, the footer, the sitemap and the per-service
JSON-LD. Adding a sixth service means adding an object, not a page.

**Blog posts** are MDX in `content/blog/`, read at build time. Frontmatter is
validated with Zod, so a post with a broken date or a missing description fails
the build instead of publishing badly. Reading time is computed, tags are
collected automatically, and `/blog/feed.xml` is generated from the same source.

**Motion** is hand-rolled rather than a library, for three reasons that matter
on a site whose traffic is SEO-driven:

1. `<Reveal>` is a **server** component. It emits data attributes only; one
   shared IntersectionObserver in the layout drives every reveal on the page. So
   scroll animation costs no per-element client JavaScript and sections stay
   server-rendered.
2. The hidden state is CSS scoped to `.js`, set by an inline script before first
   paint. **Without JavaScript nothing is ever hidden**, so crawlers and no-JS
   visitors always see complete content. An inline 3-second failsafe reveals
   everything if hydration never happens.
3. **Above-the-fold hero text is deliberately not animated.** Fading in the LCP
   element delays LCP by the length of the animation. Motion starts below the
   fold.

Horizontal (`left`/`right`) reveal variants are scoped to ≥768px, because a
translateX can push content past the edge of a phone screen mid-animation.

## How it is layered

Requests flow one direction, and each layer only knows the one below it:

```
route handler / server action   transport — parse, map errors to HTTP, no rules
        ↓
lib/leads/service.ts            the rules: validate, rate limit, persist, notify
        ↓
lib/leads/repository.ts         the only module that writes SQL for leads
        ↓
lib/db/                         schema + connection
```

Two things fall out of this. `lib/leads/validation.ts` is imported by *both* the
browser form and the API route, so the two can never disagree about what a valid
lead is. And the service returns a `Result` (`lib/result.ts`) rather than throwing
for expected outcomes — a caller cannot forget to handle "rate limited", because
the type will not let it.

`server-only` is imported at the top of every module that touches secrets or the
database; if one is ever pulled into a client component the build fails rather
than shipping credentials to the browser.

## Layout

```
app/
  layout.tsx            <html>/<body>, metadata, Organization JSON-LD, modal provider
  (site)/
    layout.tsx          header + footer chrome for the main marketing site
    page.tsx            homepage — composes the 14 sections, FAQPage JSON-LD
    services/           index + [slug], driven by content/services.ts
    industries/         index + [slug], the sector view of the same stack
    blog/               index, [slug], feed.xml
    about/ contact/     company story; contact with the inline lead form
    clients/ careers/   proof page; careers with general application
    privacy-policy/     new — the footer had linked to a non-existent page
    terms-conditions/   new — same
  products/page.tsx     port of products.html; has its own dark nav/footer,
                        which is why the chrome lives in (site) and not the root
  sitemap.ts robots.ts  generated at build time
  icon.png              favicon (was Fevicon.png.png, 1.09MB → 80KB)
components/
  sections/             one file per homepage section, all server components
  site-header.tsx       client — mobile drawer state
  demo-modal.tsx        client — modal context + <DemoButton>
  api/leads/route.ts    public lead capture
  admin/
    login/              unguarded, deliberately outside the protected group
    (protected)/        layout guards everything beneath it
      page.tsx          lead list: filter, search, paginate
      leads/[id]/       detail: status, notes, attribution
      export/route.ts   CSV
components/
  page-hero.tsx         shared hero for secondary pages
  cta-band.tsx          shared closing CTA
  lead-form.tsx         inline form; shares lib/use-lead-submit.ts with the modal
  motion/               Reveal (server), RevealObserver (one client observer), Counter
  icon.tsx              name -> react-icons registry used by content files
content/
  services.ts           the five service pages
  blog/*.mdx            posts
lib/
  blog.ts               MDX reading + frontmatter validation
  site.ts               contact details, nav, service list — single source of truth
  faqs.ts               shared by the FAQ section and its JSON-LD
  env.ts                validated server env, lazily so builds don't need a DB
  result.ts             Result<T, E> for expected failures
  csv.ts                CSV writer with spreadsheet-injection defence
  rate-limit.ts         Postgres-backed fixed-window limiter
  attribution.ts        UTM capture (client-safe)
  db/                   schema.ts, client.ts
  leads/                validation, types, repository, service, actions
  auth/                 password, session, guard, actions
  email/                Resend client + lead notification
drizzle/                generated SQL migrations — commit these
tests/                  Vitest: validation, service, csv, password
```

## Notes for whoever picks this up

- **The demo form still posts to Formspree.** Phase 2 replaces `form.action` in
  `components/demo-modal.tsx` with `POST /api/leads` backed by Postgres.
- **Only two components ship JavaScript** — the header and the modal. Every section is a
  server component, so its markup and icons cost nothing on the client. Keep it that way:
  reach for `<DemoButton>` rather than making a whole section a client component.
- **Icons are `react-icons/fa6`, not lucide.** The legacy site used Font Awesome 6, so these
  are the identical glyphs — but rendered as inline SVG, with no 258KB webfont. The
  `svg[stroke="currentColor"][fill="currentColor"]` rule in `globals.css` gives them Font
  Awesome's inline metrics so spacing matches; don't delete it.
- **`--font-sans` and the h1 line-height are pinned on purpose.** Tailwind 4.3 changed its
  default font stack, and v4 resolves `text-6xl` + `leading-tight` differently from v3.
  Both are pinned in place to match the legacy rendering exactly.
- **The brand palette in `app/globals.css` is deliberately non-standard** (900/950 are darker
  than Tailwind's stock purple). It was copied verbatim from the legacy inline
  `tailwind.config`. Don't "fix" it.
- **Legal pages are unreviewed drafts.** They describe what the site actually does, but they
  need a lawyer before you rely on them.
- **`/products` intentionally differs from the live `products.html`.** The legacy page's
  own CSS asks for a 1200px container, but `margin: 0 auto` on a flex-column child disables
  `align-items: stretch`, so it shrink-wraps to 916px and the cards fall into 2 columns with
  an orphan. This port uses the container width and grid rule as written, giving 3 columns.
  Revert `app/products/page.tsx` to a fixed `max-w-[916px]` if you want the live behaviour.
- The legacy `index.html` and `products.html` are still in the repo root, untouched and
  still live. Nothing here affects them.

## Data and privacy

- **IP addresses are never stored in the clear.** `hashIdentifier()` HMACs them
  with `AUTH_SECRET` before they touch the database. That still supports rate
  limiting and abuse triage, and it is the minimum we can justify holding as a
  Data Fiduciary under the DPDP Act.
- **Deleting a lead cascades to its notes**; removing a user leaves their notes
  in place with the author name intact, so history survives staff changes.
- The privacy policy says enquiries are kept for 24 months. Nothing enforces
  that yet — it needs a scheduled job, and it is the main open compliance item.

## Production notes

- **Security headers** live in `next.config.ts`: CSP, HSTS, `X-Frame-Options: DENY`,
  `nosniff`, Referrer-Policy, Permissions-Policy. The CSP is a static header rather than a
  per-request nonce, because a nonce would force every route to render dynamically. If you
  add a third-party script or embed, it must be added to the CSP or it will be blocked.
- **Previews are noindex.** `robots.ts` and the root metadata gate on `isProduction`
  (`lib/site.ts`), so preview deploys never get indexed or emit production canonicals.
- **`app/opengraph-image.tsx`** generates the 1200x630 social card at build time. The raw
  logo is transparent and vanished on dark backgrounds; this composites it on brand colour.
- **Accessibility:** skip link, a global `:focus-visible` ring (several legacy elements had
  `focus:outline-none` with no replacement), a focus trap and focus restore on the demo
  modal, and `prefers-reduced-motion` honoured globally.
- **The CSP allows `unsafe-eval` and a websocket in development only.** React's dev
  build needs eval and the dev server needs HMR; `upgrade-insecure-requests` is also
  dropped in dev because it rewrites the local websocket to wss. Production keeps all
  three restrictions. If you add a third-party embed, it must go in the CSP.
- **`<html>` carries `suppressHydrationWarning`** because the inline script adds a
  `js` class before React hydrates. It is scoped to that element's attributes only.
- **Tap targets** were padded to a 24px minimum. This is the one deliberate visual change
  from the legacy site: it makes the footer link lists slightly taller and is why the page
  measures 11,426px against the legacy 11,368px.
- **Every lead form shares `lib/use-lead-submit.ts`** — the modal, the contact page
  and the careers page. Validation handling, attribution capture and error copy cannot
  drift apart between them.
- **The demo form posts to `/api/leads`.** Formspree is gone, and the CSP no longer
  allows it. Defences on that endpoint: a honeypot, five submissions per IP per hour,
  and validation shared with the client.
- **The honeypot answers 201.** A 422 naming the `_gotcha` field would tell a bot
  exactly what unmasked it, so a trapped submission looks like success and is
  silently dropped. There is a test asserting the error kind is `rejected` and not
  `validation`, because that distinction is easy to break by accident.
- **A failed notification email never fails a lead.** The lead is committed first;
  the send is fire-and-forget and only logs on failure.
- **Sessions** are HS256 JWTs in an httpOnly, SameSite=Lax cookie, 8 hour expiry.
  Every request re-reads the user, so a deleted account loses access immediately
  rather than whenever its token happens to expire.

## CI

`.github/workflows/ci.yml` runs typecheck, lint and build on every push and PR.

## Deploying to Vercel

The app builds with **no environment variables at all** — all 34 pages prerender, so the
marketing site works immediately. The database is only needed for the demo form and
`/admin`; without it those two fail and nothing else does.

1. **Push this repo to GitHub.** Everything except `node_modules/`, `.next/` and the
   `.env*` files (roughly 2.4 MB).

2. **Import it on Vercel** — vercel.com/new → pick the repo → set
   **Root Directory: `web`**. Framework and build command are detected. Deploy.
   You now have a working preview URL, which is served `noindex` (see `robots.ts`).

3. **Create a Postgres database.** Vercel Storage → Neon, or neon.tech directly. Copy the
   **pooled** connection string.

4. **Add environment variables** in Project → Settings → Environment Variables:

   | Name | Value | Required |
   | --- | --- | --- |
   | `DATABASE_URL` | Neon pooled connection string | for leads + admin |
   | `AUTH_SECRET` | `openssl rand -base64 32` | for leads + admin |
   | `RESEND_API_KEY` | from resend.com | optional |
   | `LEAD_NOTIFICATION_TO` | `growth@novapulse.co.in` | optional |
   | `LEAD_NOTIFICATION_FROM` | `Nova Pulse <notifications@yourdomain>` | optional |

   `AUTH_SECRET` signs admin sessions **and** the HMAC that hashes visitor IPs — changing
   it later logs everyone out and orphans existing rate-limit buckets.

5. **Run the migration once**, from your machine against the remote database:

   ```bash
   cd web
   DATABASE_URL="<neon-pooled-url>" npm run db:migrate
   ```

   Migrations are deliberately *not* wired into the build: preview deploys share the same
   database, and you do not want a preview build migrating production.

6. **Create your admin login:**

   ```bash
   DATABASE_URL="<neon-pooled-url>" npm run db:seed-admin
   ```

7. **Redeploy** so the new variables are picked up, then check `/`, submit the demo form,
   and sign in at `/admin`.

8. **Point the domain.** Project → Settings → Domains → add `novapulse.co.in` and
   `www.novapulse.co.in`, then update DNS at your registrar. Only do this once the preview
   looks right — until then the old site stays live and untouched.

`NEXT_PUBLIC_SITE_URL` is only needed if you deploy somewhere other than Vercel; on Vercel
the canonical URL is inferred, and previews resolve to their own host (see `lib/site.ts`).
