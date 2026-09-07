# Nova Pulse

[![CI](https://github.com/novapulse1/novapulse1/actions/workflows/ci.yml/badge.svg)](https://github.com/novapulse1/novapulse1/actions/workflows/ci.yml)

Website and lead platform for [Nova Pulse](https://www.novapulse.co.in) — HRMS and payroll,
biometric attendance, workplace security, corporate hiring and B2B lead generation for
growing businesses in Delhi NCR and Uttar Pradesh.

## What is in this repo

```
.
├── web/                    the application — marketing site, admin, API
├── index.html              the original single-page site (still live)
├── products.html           the original product page
├── *.png *.jpg             images used by the original site
└── .github/workflows/      CI: typecheck, lint, test, build
```

The files at the root are the **original hand-written site** that currently serves
novapulse.co.in. They are untouched and still deployable. Everything new lives in
[`web/`](web) and does not affect them — so the old site keeps running until the domain
is deliberately pointed at the new one.

## The site

34 pages, all prerendered as static HTML except the admin area and the API.

| Area | Pages |
| --- | --- |
| Marketing | Home, About, Contact, Clients & Partners, Careers |
| Services | Index plus HRMS & Payroll, Biometric Attendance, Workplace Security, Corporate Hiring, B2B Lead Generation |
| Industries | Index plus Manufacturing, Healthcare, Retail & Distribution, IT & BPO, Schools & Institutes |
| Blog | Index with tag filtering, MDX posts, RSS feed |
| Legal | Privacy Policy, Terms of Service |
| Admin | Lead dashboard, lead detail, CSV export — behind auth |

Ten original SVG illustrations, one per service and industry page. No stock photography
and no third-party imagery: everything is drawn in-repo and owned outright.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Drizzle ORM |
| Validation | Zod — one schema shared by browser and server |
| Auth | Signed JWT session cookie (`jose`) + bcrypt |
| Email | Resend (optional) |
| Tests | Vitest — 42 tests against a real Postgres |

There is no separate backend service. The API routes, server actions and database access
all live inside the same Next.js app and deploy as one unit.

## Quick start

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

That is enough to run the whole marketing site. A database is only needed for the demo
form and `/admin`:

```bash
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET
npm run db:migrate
npm run db:seed-admin
```

## Deploying

Vercel, with **Root Directory** set to `web`. The app builds with no environment variables
at all, so the marketing site can go live before the database exists.

Full instructions, environment variables and migration steps are in
[`web/README.md`](web/README.md#deploying-to-vercel).

## Contact

- Web — https://www.novapulse.co.in
- Email — growth@novapulse.co.in
- Phone / WhatsApp — +91 87966 23604

## Licence

[MIT](LICENSE).
