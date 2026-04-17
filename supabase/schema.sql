-- =====================================================
-- NuroHealth — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  nrc         text,
  date_of_birth date,
  gender      text check (gender in ('male', 'female', 'other')),
  phone       text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

-- ─── Plans ───────────────────────────────────────────
create table if not exists public.plans (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  price            numeric(10,2) not null,
  description      text,
  coverage_details jsonb default '[]',
  features         text[] default '{}',
  is_active        boolean not null default true,
  color            text default 'from-primary-600 to-primary-800',
  created_at       timestamptz not null default now()
);

-- ─── Subscriptions ───────────────────────────────────
create table if not exists public.subscriptions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.profiles(id) on delete cascade not null,
  plan_id        uuid references public.plans(id) not null,
  status         text not null default 'active'
                   check (status in ('active', 'expired', 'cancelled', 'pending')),
  start_date     timestamptz not null,
  end_date       timestamptz not null,
  policy_number  text not null unique,
  created_at     timestamptz not null default now()
);

-- ─── Claims ──────────────────────────────────────────
create table if not exists public.claims (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.profiles(id) on delete cascade not null,
  subscription_id  uuid references public.subscriptions(id),
  type             text not null
                     check (type in ('consultation','medication','lab','hospitalization','dental')),
  amount           numeric(10,2) not null,
  status           text not null default 'submitted'
                     check (status in ('submitted','reviewing','approved','rejected','paid')),
  notes            text,
  receipt_url      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger claims_updated_at
  before update on public.claims
  for each row execute function update_updated_at();

-- ─── Row Level Security ──────────────────────────────
alter table public.profiles      enable row level security;
alter table public.plans         enable row level security;
alter table public.subscriptions enable row level security;
alter table public.claims        enable row level security;

-- Profiles: users can read/update their own row; admins can read all
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Plans: everyone can read active plans
create policy "Public can read active plans"
  on public.plans for select using (is_active = true);

-- Subscriptions: users see their own; admins see all
create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own subscriptions"
  on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update own subscriptions"
  on public.subscriptions for update using (auth.uid() = user_id);
create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Claims: users see their own; admins see all and can update
create policy "Users can view own claims"
  on public.claims for select using (auth.uid() = user_id);
create policy "Users can insert own claims"
  on public.claims for insert with check (auth.uid() = user_id);
create policy "Admins can view all claims"
  on public.claims for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admins can update any claim"
  on public.claims for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- ─── Storage Bucket ──────────────────────────────────
-- Run in Storage tab or via API:
-- Create bucket "receipts" with public = false
-- Policy: authenticated users can upload/read their own files

-- ─── Seed Plans ──────────────────────────────────────
insert into public.plans (name, price, description, features, coverage_details, color) values
(
  'Basic Care', 150,
  'Essential coverage for individuals needing primary healthcare access.',
  array['GP Consultations (6/year)', 'Medication Cover (ZMW 500/month)', 'Emergency Care', 'Basic Lab Tests'],
  '[{"category":"Outpatient","limit":"ZMW 6,000/year","description":"GP visits"},{"category":"Medication","limit":"ZMW 500/month","description":"Prescribed medications"},{"category":"Emergency","limit":"ZMW 10,000/incident","description":"Emergency room visits"}]'::jsonb,
  'from-blue-500 to-blue-700'
),
(
  'Standard Health', 350,
  'Comprehensive cover for families with outpatient and inpatient benefits.',
  array['Unlimited GP Visits', 'Specialist Referrals', 'Hospitalization (7 days)', 'Medication (ZMW 1,500/month)', 'Dental Basic', 'Eye Tests'],
  '[{"category":"Outpatient","limit":"Unlimited","description":"All GP and specialist visits"},{"category":"Inpatient","limit":"ZMW 50,000/year","description":"Hospital stays up to 7 days"},{"category":"Dental","limit":"ZMW 3,000/year","description":"Basic dental procedures"}]'::jsonb,
  'from-green-500 to-green-700'
),
(
  'Premium Plus', 750,
  'Full-spectrum healthcare coverage for individuals and families.',
  array['Unlimited Consultations', 'Full Specialist Access', 'Hospitalization (unlimited)', 'Maternity Cover', 'Comprehensive Dental', 'Mental Health Support'],
  '[{"category":"Outpatient","limit":"Unlimited","description":"All medical consultations"},{"category":"Inpatient","limit":"ZMW 200,000/year","description":"Unlimited hospital stays"},{"category":"Maternity","limit":"ZMW 20,000","description":"Prenatal, delivery and postnatal"}]'::jsonb,
  'from-purple-500 to-purple-700'
);
