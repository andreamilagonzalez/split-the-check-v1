-- Supabase → SQL Editor → paste → Run
create table if not exists checks (
  id bigint generated always as identity primary key,
  label text,
  bill numeric(10,2) not null,
  tip_pct int not null,
  people int not null,
  tip numeric(10,2) not null,
  total numeric(10,2) not null,
  per_person numeric(10,2) not null,
  created_at timestamptz not null default now()
);
-- Lock it down: no public access. Only the app's server can read/write.
alter table checks enable row level security;
