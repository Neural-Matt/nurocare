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
  amount           numeric(10,2) not null check (amount > 0),
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

-- ─── Facilities ──────────────────────────────────────
-- Reference/directory data — same public-read pattern as plans.
create table if not exists public.facilities (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  type         text not null check (type in ('hospital', 'clinic', 'pharmacy')),
  address      text not null,
  phone        text not null,
  distance_km  numeric(5,1),
  covered      boolean not null default false,
  open_now     boolean not null default true,
  hours        text,
  services     text[] default '{}',
  lat          numeric(9,6) not null,
  lng          numeric(9,6) not null,
  rating       numeric(2,1),
  created_at   timestamptz not null default now()
);

-- ─── Drugs ───────────────────────────────────────────
create table if not exists public.drugs (
  id                     uuid primary key default uuid_generate_v4(),
  name                   text not null,
  generic_name           text not null,
  usage_description      text not null,
  dosage                 text not null,
  side_effects           text[] default '{}',
  category               text not null,
  prescription_required  boolean not null default false,
  created_at             timestamptz not null default now()
);

-- ─── Doctors ─────────────────────────────────────────
create table if not exists public.doctors (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  specialty         text not null
                      check (specialty in ('general','paediatrics','dermatology','mental_health','gynaecology','nutrition')),
  qualifications    text,
  experience_years  int not null default 0,
  languages         text[] default '{}',
  availability      text not null default 'offline' check (availability in ('available','busy','offline')),
  next_available    text,
  rating            numeric(2,1),
  consult_count     int not null default 0,
  whatsapp_number   text not null,
  avatar_initials   text not null,
  avatar_color      text not null default 'bg-primary-500',
  created_at        timestamptz not null default now()
);

-- ─── Family Members ──────────────────────────────────
create table if not exists public.family_members (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  name          text not null,
  relationship  text not null check (relationship in ('spouse','child','parent','sibling','other')),
  date_of_birth date not null,
  gender        text not null check (gender in ('male','female','other')),
  plan_id       uuid references public.plans(id),
  created_at    timestamptz not null default now()
);

-- ─── Payments ────────────────────────────────────────
-- No insert/update policy is granted to regular users below — there is no
-- payment gateway wired up yet, so the only legitimate writer of this table
-- is a future server-side webhook using the service role key (which bypasses
-- RLS entirely). Users can only ever read their own payment history.
create table if not exists public.payments (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.profiles(id) on delete cascade not null,
  subscription_id  uuid references public.subscriptions(id),
  amount           numeric(10,2) not null check (amount > 0),
  currency         text not null default 'ZMW',
  status           text not null default 'pending' check (status in ('success','failed','pending','refunded')),
  method           text not null check (method in ('mtn_momo','airtel_money','card','bank')),
  reference        text not null unique,
  description      text,
  created_at       timestamptz not null default now()
);

-- ─── Notifications ───────────────────────────────────
create table if not exists public.notifications (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  type         text not null check (type in ('claim_update','payment_reminder','coverage_status','general')),
  title        text not null,
  message      text not null,
  read         boolean not null default false,
  action_href  text,
  created_at   timestamptz not null default now()
);

-- ─── Security Triggers ────────────────────────────────
-- RLS policies alone can't compare a row's old vs. new values (USING/WITH
-- CHECK only see one side), so column-level tampering protection for
-- self-service updates has to happen in triggers, not policies.

-- Prevent a non-admin from promoting themselves (or anyone) to admin by
-- calling profiles.update({ role: 'admin' }) directly from the client.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ) then
      new.role = old.role;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- Users may cancel their own subscription (status -> 'cancelled'), but must
-- not be able to rewrite end_date/policy_number/plan_id or reactivate it
-- themselves — that has to go through a verified payment/admin path.
create or replace function public.restrict_subscription_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_admin boolean;
begin
  -- auth.uid() is null for service-role/backend callers (e.g. a future
  -- payment webhook) — those are trusted and bypass this check entirely.
  if auth.uid() is null then
    return new;
  end if;

  select (role = 'admin') into caller_is_admin
  from public.profiles where id = auth.uid();

  if coalesce(caller_is_admin, false) then
    return new;
  end if;

  if new.user_id is distinct from old.user_id
     or new.plan_id is distinct from old.plan_id
     or new.policy_number is distinct from old.policy_number
     or new.start_date is distinct from old.start_date
     or new.end_date is distinct from old.end_date then
    raise exception 'Not permitted to modify this field';
  end if;

  if new.status is distinct from old.status and new.status <> 'cancelled' then
    raise exception 'Users may only cancel their own subscription';
  end if;

  return new;
end;
$$;

create trigger subscriptions_restrict_self_update
  before update on public.subscriptions
  for each row execute function public.restrict_subscription_self_update();

-- Family members are freely editable by their owner, but reassigning
-- ownership to someone else's account should never happen from the client.
create or replace function public.restrict_family_member_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and new.user_id is distinct from old.user_id then
    raise exception 'Not permitted to modify this field';
  end if;
  return new;
end;
$$;

create trigger family_members_restrict_self_update
  before update on public.family_members
  for each row execute function public.restrict_family_member_self_update();

-- Users may only ever flip their own notification's `read` flag — the
-- content itself is system-generated (see claims_notify_status_change below).
create or replace function public.restrict_notification_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new; -- service-role/backend caller
  end if;

  if new.user_id is distinct from old.user_id
     or new.type is distinct from old.type
     or new.title is distinct from old.title
     or new.message is distinct from old.message
     or new.action_href is distinct from old.action_href then
    raise exception 'Not permitted to modify this field';
  end if;

  return new;
end;
$$;

create trigger notifications_restrict_self_update
  before update on public.notifications
  for each row execute function public.restrict_notification_self_update();

-- Notifications have no client-facing insert policy at all (see RLS below),
-- so this is currently the only way a real notification row gets created:
-- automatically, whenever an admin (or future backend job) changes a claim's
-- status. security definer lets it insert into another user's notifications
-- row despite the caller (an admin) not being that user.
create or replace function public.notify_on_claim_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.notifications (user_id, type, title, message, action_href)
    values (
      new.user_id,
      'claim_update',
      case new.status
        when 'approved'  then 'Claim approved'
        when 'rejected'  then 'Claim rejected'
        when 'paid'      then 'Claim paid'
        when 'reviewing' then 'Claim under review'
        else 'Claim updated'
      end,
      case new.status
        when 'approved'  then 'Your ' || new.type || ' claim has been approved.'
        when 'rejected'  then 'Your ' || new.type || ' claim was rejected. Open it for details.'
        when 'paid'      then 'Your ' || new.type || ' claim has been paid out.'
        when 'reviewing' then 'Your ' || new.type || ' claim is now under review.'
        else 'Your ' || new.type || ' claim status changed to ' || new.status || '.'
      end,
      '/claims/' || new.id
    );
  end if;
  return new;
end;
$$;

create trigger claims_notify_status_change
  after update on public.claims
  for each row execute function public.notify_on_claim_status_change();

-- ─── Row Level Security ──────────────────────────────
alter table public.profiles      enable row level security;
alter table public.plans         enable row level security;
alter table public.subscriptions enable row level security;
alter table public.claims        enable row level security;
alter table public.facilities    enable row level security;
alter table public.drugs         enable row level security;
alter table public.doctors       enable row level security;
alter table public.family_members enable row level security;
alter table public.payments      enable row level security;
alter table public.notifications enable row level security;

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
  on public.claims for insert
  with check (auth.uid() = user_id and status = 'submitted');
create policy "Admins can view all claims"
  on public.claims for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Admins can update any claim"
  on public.claims for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Family members: fully owned by the user
create policy "Users can view own family members"
  on public.family_members for select using (auth.uid() = user_id);
create policy "Users can insert own family members"
  on public.family_members for insert with check (auth.uid() = user_id);
create policy "Users can update own family members"
  on public.family_members for update using (auth.uid() = user_id);
create policy "Users can delete own family members"
  on public.family_members for delete using (auth.uid() = user_id);

-- Payments: users can only ever read their own — see the comment on the
-- table definition for why there's deliberately no insert/update policy.
create policy "Users can view own payments"
  on public.payments for select using (auth.uid() = user_id);
create policy "Admins can view all payments"
  on public.payments for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Notifications: users read their own and can mark them read (see the
-- restrict_notification_self_update trigger); there is deliberately no
-- insert policy — rows are only ever created by notify_on_claim_status_change.
create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- Facilities, drugs, doctors: public reference/directory data, no PII —
-- readable by anyone with the anon key (the app routes are still gated by
-- middleware; this is just the data-layer policy).
create policy "Public can read facilities"
  on public.facilities for select using (true);
create policy "Public can read drugs"
  on public.drugs for select using (true);
create policy "Public can read doctors"
  on public.doctors for select using (true);

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
  '[{"category":"Outpatient","limit":"ZMW 6,000/year","description":"GP visits and consultations"},{"category":"Medication","limit":"ZMW 500/month","description":"Prescribed medications"},{"category":"Emergency","limit":"ZMW 10,000/incident","description":"Emergency room visits"},{"category":"Lab Tests","limit":"ZMW 2,000/year","description":"Basic blood and urine tests"}]'::jsonb,
  'from-primary-800 to-primary-700'
),
(
  'Standard Health', 350,
  'Comprehensive cover for families with outpatient and inpatient benefits.',
  array['Unlimited GP Visits', 'Specialist Referrals', 'Hospitalization (up to 7 days)', 'Medication Cover (ZMW 1,500/month)', 'Dental Basic', 'Eye Tests'],
  '[{"category":"Outpatient","limit":"Unlimited","description":"All GP and specialist visits"},{"category":"Inpatient","limit":"ZMW 50,000/year","description":"Hospital stays up to 7 days"},{"category":"Medication","limit":"ZMW 1,500/month","description":"All prescribed medications"},{"category":"Dental","limit":"ZMW 3,000/year","description":"Basic dental procedures"},{"category":"Vision","limit":"ZMW 1,500/year","description":"Eye tests and basic frames"}]'::jsonb,
  'from-accent-500 to-accent-700'
),
(
  'Premium Plus', 750,
  'Full-spectrum healthcare coverage for individuals and families.',
  array['Unlimited Consultations', 'Full Specialist Access', 'Hospitalization (unlimited days)', 'Maternity Cover', 'Comprehensive Dental', 'Full Vision Cover', 'Mental Health Support', 'International Emergency'],
  '[{"category":"Outpatient","limit":"Unlimited","description":"All medical consultations"},{"category":"Inpatient","limit":"ZMW 200,000/year","description":"Unlimited hospital stays"},{"category":"Maternity","limit":"ZMW 20,000","description":"Prenatal, delivery and postnatal"},{"category":"Dental","limit":"ZMW 8,000/year","description":"Full dental coverage"},{"category":"Mental Health","limit":"ZMW 5,000/year","description":"10 sessions/year"},{"category":"International","limit":"USD 10,000","description":"Emergency cover abroad"}]'::jsonb,
  'from-warning-500 to-warning-600'
);

-- ─── Seed Facilities ─────────────────────────────────
insert into public.facilities (name, type, address, phone, distance_km, covered, open_now, hours, services, lat, lng, rating) values
('University Teaching Hospital', 'hospital', 'Nationalist Road, Lusaka', '+260 211 254 131', 1.2, true, true, 'Open 24 hours', array['Emergency','Surgery','Maternity','Paediatrics','ICU','Radiology'], -15.4117, 28.2996, 4.1),
('Maina Soko Military Hospital', 'hospital', 'Leopards Hill Road, Lusaka', '+260 211 273 044', 3.8, true, true, 'Open 24 hours', array['Emergency','Orthopaedics','Surgery','General Medicine'], -15.3880, 28.3320, 3.9),
('Levy Mwanawasa General Hospital', 'hospital', 'Church Road, Lusaka', '+260 211 222 821', 2.1, false, true, 'Open 24 hours', array['Emergency','Maternity','Paediatrics','General Medicine'], -15.4234, 28.2785, 3.7),
('Lusaka Trust Hospital', 'hospital', '2 Paseli Road, Northmead, Lusaka', '+260 211 234 567', 4.5, true, false, 'Mon–Sat 07:00–22:00', array['Outpatient','Surgery','Oncology','Cardiology','Dental'], -15.3970, 28.3150, 4.4),
('Care for Business Clinic', 'clinic', 'Cairo Road, Lusaka CBD', '+260 211 226 065', 0.7, true, true, 'Mon–Fri 08:00–17:00', array['GP Consultations','Blood Tests','Vaccinations','Occupational Health'], -15.4165, 28.2831, 4.6),
('Crossroads Medical Centre', 'clinic', 'Crossroads, Woodlands, Lusaka', '+260 211 262 099', 5.3, true, true, 'Daily 07:30–21:00', array['GP','Specialist Referrals','Ultrasound','Minor Surgery'], -15.4410, 28.3220, 4.3),
('Avic International Health Centre', 'clinic', 'East Park Mall, Thabo Mbeki Road', '+260 960 000 099', 3.2, false, true, 'Mon–Sat 08:00–20:00', array['GP Consultations','Dental','Eye Tests','Pharmacy'], -15.4070, 28.3340, 4.2),
('Chainama Hills Health Centre', 'clinic', 'Chainama Hills, Lusaka East', '+260 211 276 510', 7.1, true, false, 'Mon–Fri 08:00–16:30', array['Mental Health','GP','Counselling','Psychiatry'], -15.3730, 28.3560, 3.8),
('Zambia Pharmacy (Cairo Road)', 'pharmacy', 'Cairo Road, Central Lusaka', '+260 211 226 500', 0.4, true, true, 'Mon–Sat 08:00–18:00', array['Prescription Dispensing','OTC Medicines','Health Advice'], -15.4160, 28.2840, 4.0),
('Clicks Pharmacy — Manda Hill', 'pharmacy', 'Manda Hill Mall, Great East Road', '+260 211 257 888', 2.9, true, true, 'Daily 08:00–21:00', array['Prescription Drugs','Baby & Mother','Cosmetics','Health Monitoring'], -15.3985, 28.3240, 4.5),
('Pep Pharmacy — Arcades', 'pharmacy', 'Arcades Shopping Centre, Great East Road', '+260 211 290 100', 4.1, false, true, 'Daily 09:00–20:00', array['OTC Medicines','Vitamins & Supplements','Prescription Dispensing'], -15.3920, 28.3410, 3.9),
('HealthPlus Pharmacy — Kabulonga', 'pharmacy', 'Kabulonga Road, Lusaka', '+260 976 543 210', 6.0, true, false, 'Mon–Sat 08:00–19:00', array['24hr Emergency Dispensing','Chronic Medication','Health Screening'], -15.4450, 28.3080, 4.7);

-- ─── Seed Drugs ──────────────────────────────────────
insert into public.drugs (name, generic_name, usage_description, dosage, side_effects, category, prescription_required) values
('Paracetamol', 'Acetaminophen', 'Relief of mild to moderate pain and fever reduction', 'Adults: 500mg–1g every 4–6 hours (max 4g/day). Children: 15mg/kg every 4–6 hours.', array['Nausea','Rash (rare)','Liver damage (overdose)'], 'Analgesic / Antipyretic', false),
('Amoxicillin', 'Amoxicillin trihydrate', 'Treatment of bacterial infections (respiratory, urinary, skin)', 'Adults: 250–500mg every 8 hours for 5–10 days as directed.', array['Diarrhea','Rash','Nausea','Allergic reaction'], 'Antibiotic', true),
('Metformin', 'Metformin hydrochloride', 'Management of type 2 diabetes mellitus', 'Starting dose: 500mg twice daily with meals. Max: 2000–2550mg/day.', array['Nausea','Diarrhea','Stomach upset','Lactic acidosis (rare)'], 'Antidiabetic', true),
('Lisinopril', 'Lisinopril', 'Treatment of high blood pressure and heart failure', 'Adults: 10mg once daily, may increase to 40mg/day.', array['Dry cough','Dizziness','Headache','Hyperkalemia'], 'ACE Inhibitor', true),
('Ibuprofen', 'Ibuprofen', 'Relief of pain, fever, and inflammation', 'Adults: 200–400mg every 4–6 hours (max 1200mg/day OTC).', array['Stomach upset','Heartburn','Dizziness','Kidney issues (long-term)'], 'NSAID', false),
('Atorvastatin', 'Atorvastatin calcium', 'Lowering cholesterol and reducing risk of cardiovascular disease', 'Adults: 10–80mg once daily, usually taken in the evening.', array['Muscle pain','Liver enzyme elevation','Headache','Nausea'], 'Statin', true),
('Artemether/Lumefantrine', 'Artemether + Lumefantrine', 'Treatment of uncomplicated malaria caused by Plasmodium falciparum', '6 doses over 3 days. Weight-based dosing for children.', array['Headache','Dizziness','Loss of appetite','Joint pain'], 'Antimalarial', true),
('Omeprazole', 'Omeprazole', 'Treatment of acid reflux, peptic ulcers, and GERD', 'Adults: 20–40mg once daily before breakfast.', array['Headache','Diarrhea','Nausea','Abdominal pain'], 'Proton Pump Inhibitor', false);

-- ─── Seed Doctors ────────────────────────────────────
insert into public.doctors (name, specialty, qualifications, experience_years, languages, availability, next_available, rating, consult_count, whatsapp_number, avatar_initials, avatar_color) values
('Dr. Chanda Mwila', 'general', 'MBChB, UNZA', 8, array['English','Bemba','Nyanja'], 'available', null, 4.8, 312, '260971000001', 'CM', 'bg-accent-500'),
('Dr. Nkandu Banda', 'paediatrics', 'MBChB, DCH', 12, array['English','Nyanja'], 'busy', '14:30', 4.9, 541, '260971000002', 'NB', 'bg-blue-500'),
('Dr. Mutinta Phiri', 'mental_health', 'MBChB, MRCPsych', 6, array['English','Tonga'], 'available', null, 4.7, 198, '260971000003', 'MP', 'bg-violet-500'),
('Dr. Abel Sinkala', 'dermatology', 'MBChB, Dip Derm', 10, array['English','Bemba'], 'offline', 'Tomorrow 09:00', 4.6, 267, '260971000004', 'AS', 'bg-warning-500'),
('Dr. Charity Tembo', 'gynaecology', 'MBChB, MRCOG', 15, array['English','Nyanja','Bemba'], 'available', null, 4.9, 723, '260971000005', 'CT', 'bg-rose-500');
