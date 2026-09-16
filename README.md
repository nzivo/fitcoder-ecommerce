# Fit Coder

A Next.js (App Router, TypeScript) storefront with a Supabase backend, Paystack payments
(card + M-Pesa), and an admin dashboard for managing orders, products, categories, homepage
content (hero, story, banners), testimonials, and FAQs — including real image uploads to
Supabase Storage. Designed to deploy straight to Vercel.

## Stack

- **Next.js 16** (App Router, Server Actions, Route Handlers) + TypeScript + Tailwind CSS v4
- **Supabase** — Postgres database, Auth (customers + role-based admin), Row Level Security,
  Storage (the public `media` bucket the admin dashboard uploads images into)
- **Paystack** — checkout (card, M-Pesa, bank, USSD), verified via signed webhook
- **Vercel** — hosting; all server logic runs as Vercel's Node.js functions (route handlers /
  server actions), which is what backs the "admin dashboard" for managing orders

## Project structure

```text
src/app/                # routes (homepage, shop, product, checkout, account, admin/*)
src/app/api/checkout    # creates an order + starts a Paystack transaction
src/app/api/paystack/webhook   # verifies Paystack signature, marks orders paid, decrements stock
src/app/admin/(dashboard)      # protected dashboard: orders, products, categories, homepage
                                # content, testimonials, FAQs
src/components/                # UI, organized by area (home, shop, admin, layout)
src/components/admin/ImageUploadField.tsx  # reusable upload UI used by every admin form
src/lib/supabase/              # browser / server / admin (service-role) Supabase clients
src/lib/actions/               # server actions used by the admin dashboard
src/lib/actions/upload.ts      # uploads files to the "media" Storage bucket, returns public URLs
supabase/migrations/0001_init.sql   # core schema, RLS policies, seed categories/products
supabase/migrations/0002_content_management.sql  # Storage bucket + site_sections/testimonials/faqs
scripts/gen-placeholders.mjs        # regenerates the placeholder SVG imagery in /public
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/migrations/0002_content_management.sql` (in that order). Together they create all
   tables, the public `media` Storage bucket, RLS/Storage policies, and seed starter
   categories/products/homepage content/testimonials/FAQs (using placeholder images).
3. Grab your keys from **Project Settings → API**: `Project URL`, `anon public` key, and
   `service_role` key (keep the service role key secret — it's server-only).
4. Sign up for an account in the app (`/account`, or `/admin/login`), then in the SQL editor run:
   ```sql
   update public.profiles set is_admin = true where email = 'you@example.com';
   ```
   That account can now sign in at `/admin`.

## 2. Set up Paystack (for M-Pesa + card payments)

1. Create an account at [paystack.com](https://paystack.com) and complete KYC for a Kenyan
   business to enable the **M-Pesa** channel (mobile money) alongside cards.
2. Copy your **Secret Key** from Settings → API Keys & Webhooks.
3. Add a webhook pointing to `https://<your-domain>/api/paystack/webhook` — this is how orders
   get marked "paid" and stock gets decremented. (The order confirmation page also does a
   fallback verification call, so payments still confirm even before the webhook lands.)

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the Supabase + Paystack values from above.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin` for the
dashboard (requires an admin account, see step 1.4).

## 5. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add the same environment variables from `.env.local` in Vercel's Project Settings →
   Environment Variables.
3. Deploy. Update the Paystack webhook URL to your production domain.

## Notes on imagery

Product, category, and lifestyle imagery currently point at generated placeholder SVGs in
`/public` (see `scripts/gen-placeholders.mjs`). Replace them from the admin dashboard — every
image field (products, categories, homepage hero/story/banners) is a real file upload that
stores the file in Supabase Storage's `media` bucket and swaps in the resulting URL; no manual
URL-pasting required.

## What's manageable from `/admin`

- **Orders** — view, filter by status, update status.
- **Products** — full CRUD with multi-image upload.
- **Categories** — full CRUD with image upload (new — previously seed-data only).
- **Homepage Content** — edit the hero, "Our Story" section, seasonal banner, and lifestyle
  banner (copy + images + button links) without touching code.
- **Testimonials** — the reviews shown on the homepage.
- **FAQs** — the accordion entries on both the homepage and shop page, tagged by which page they
  appear on.
