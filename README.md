# Split the Check — Capstone v1

**What it does / who it's for:** Split the Check helps friends splitting a restaurant bill figure out what each person owes with tip, and now saves every paid check so you have a history of what you've split.

**Do this, see that:** Enter $120, tap 20%, set 4 people → "Each person pays $36.00". Type "Dinner" and tap **Paid in full** → "Dinner · $144.00 · $36.00 each" shows up under **Past checks**, and it's still there after you refresh.

## Stack
Next.js 15 · Supabase (Postgres) · Vercel

## Setup
1. Supabase → SQL Editor → run `supabase.sql`.
2. Supabase → Project Settings → API → copy **Project URL** and **service_role** key.
3. Vercel → Settings → Environment Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Redeploy.

## Security
- Keys live only in Vercel env vars; `.env*` is git-ignored.
- Supabase is called only from the server (`server-only`); the key never reaches the browser.
- Row Level Security on, no public policies.
- Inputs validated and totals recalculated on the server.
