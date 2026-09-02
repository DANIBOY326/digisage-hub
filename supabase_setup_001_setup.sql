-- ============================================================================
-- DigiSage Hub — Supabase setup
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================================

-- 1. REGISTRATIONS TABLE
-- ----------------------------------------------------------------------------
-- payment_method / payment_status / payment_amount / payment_currency /
-- payment_reference are included now so future payment methods (card,
-- online gateway) can be added later by simply allowing new values in the
-- check constraints below — no schema migration required.

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),

  -- Applicant details
  full_name text not null,
  email text not null,
  phone text not null,
  course_id text not null,
  course_name text not null,
  cohort_preference text not null,
  motivation text not null,

  -- Admin follow-up status (existing dashboard concept: pending/reviewed/contacted)
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'contacted')),

  -- Payment details (extensible for future payment methods)
  payment_method text not null default 'bank_transfer'
    check (payment_method in ('bank_transfer', 'card', 'online_gateway')),
  payment_type text not null
    check (payment_type in ('full', 'part')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'verified', 'approved', 'rejected')),
  payment_amount numeric(12, 2),
  payment_currency text not null default 'NGN',
  payment_reference text,
  payment_evidence_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists registrations_status_idx on public.registrations (status);
create index if not exists registrations_course_id_idx on public.registrations (course_id);
create index if not exists registrations_email_idx on public.registrations (email);
create index if not exists registrations_payment_status_idx on public.registrations (payment_status);
create index if not exists registrations_payment_method_idx on public.registrations (payment_method);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row
  execute function public.set_updated_at();

-- 2. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.registrations enable row level security;

-- Public (anonymous) visitors may INSERT a registration — nothing else.
drop policy if exists "public can submit registrations" on public.registrations;
create policy "public can submit registrations"
  on public.registrations
  for insert
  to anon
  with check (true);

-- Only authenticated (admin) users may read registrations.
drop policy if exists "admins can read registrations" on public.registrations;
create policy "admins can read registrations"
  on public.registrations
  for select
  to authenticated
  using (true);

-- Only authenticated (admin) users may update registrations (status changes).
drop policy if exists "admins can update registrations" on public.registrations;
create policy "admins can update registrations"
  on public.registrations
  for update
  to authenticated
  using (true)
  with check (true);

-- Only authenticated (admin) users may delete registrations.
drop policy if exists "admins can delete registrations" on public.registrations;
create policy "admins can delete registrations"
  on public.registrations
  for delete
  to authenticated
  using (true);

-- 3. STORAGE BUCKET FOR PAYMENT EVIDENCE
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('payment-evidence', 'payment-evidence', false)
on conflict (id) do nothing;

-- Public visitors may upload payment evidence — write-only, no read-back.
drop policy if exists "public can upload payment evidence" on storage.objects;
create policy "public can upload payment evidence"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'payment-evidence');

-- Only authenticated (admin) users may view payment evidence.
drop policy if exists "admins can read payment evidence" on storage.objects;
create policy "admins can read payment evidence"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'payment-evidence');

-- Only authenticated (admin) users may delete payment evidence
-- (needed when an admin deletes a registration).
drop policy if exists "admins can delete payment evidence" on storage.objects;
create policy "admins can delete payment evidence"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'payment-evidence');

-- 4. ADMIN USER
-- ----------------------------------------------------------------------------
-- Create your admin login from the Supabase Dashboard:
--   Authentication → Users → Add user → set email + password.
-- Do NOT enable public sign-ups for this project — admin accounts should
-- only ever be created manually by you from the dashboard.
