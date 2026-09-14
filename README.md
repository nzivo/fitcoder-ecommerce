# Dope Beyond

A Next.js (App Router, TypeScript) storefront with a Supabase backend, Paystack payments
(card + M-Pesa), and an admin dashboard for managing products and orders. Designed to deploy
straight to Vercel.

## Stack

- **Next.js 16** (App Router, Server Actions, Route Handlers) + TypeScript + Tailwind CSS v4
- **Supabase** — Postgres database, Auth (customers + role-based admin), Row Level Security
- **Paystack** — checkout (card, M-Pesa, bank, USSD), verified via signed webhook
- **Vercel** — hosting; all server logic runs as Vercel's Node.js functions (route handlers /
  server actions), which is what backs the "admin dashboard" for managing orders

## Project structure

```text
src/app/                # routes (homepage, shop, product, checkout, account, admin/*)
src/app/api/checkout    # creates an order + starts a Paystack transaction
src/app/api/paystack/webhook   # verifies Paystack signature, marks orders paid, decrements stock
src/app/admin/(dashboard)      # protected dashboard: orders + product CRUD
src/components/                # UI, organized by area (home, shop, admin, layout)
src/lib/supabase/              # browser / server / admin (service-role) Supabase clients
src/lib/actions/               # server actions used by the admin dashboard
supabase/migrations/0001_init.sql   # schema, RLS policies, seed categories/products
scripts/gen-placeholders.mjs        # regenerates the placeholder SVG imagery in /public
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_init.sql`. It creates all tables, RLS
   policies, and seeds starter categories/products (using placeholder images).
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
`/public` (see `scripts/gen-placeholders.mjs`). Replace them by uploading real photography to
Supabase Storage (or any URL) and pasting the URL(s) into a product's "Image URLs" field in
`/admin/products`.
