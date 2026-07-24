-- =====================================================
-- Adds family_members, payments, and notifications as
-- real backend tables. All three hooks (useFamilyMembers,
-- usePayments, useNotifications) already query these table
-- names in non-mock mode — they just didn't exist yet.
-- Safe to re-run (idempotent).
-- =====================================================

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

alter table public.family_members enable row level security;
alter table public.payments       enable row level security;
alter table public.notifications  enable row level security;

-- ─── Trigger functions ──────────────────────────────

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

drop trigger if exists family_members_restrict_self_update on public.family_members;
create trigger family_members_restrict_self_update
  before update on public.family_members
  for each row execute function public.restrict_family_member_self_update();

create or replace function public.restrict_notification_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
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

drop trigger if exists notifications_restrict_self_update on public.notifications;
create trigger notifications_restrict_self_update
  before update on public.notifications
  for each row execute function public.restrict_notification_self_update();

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

drop trigger if exists claims_notify_status_change on public.claims;
create trigger claims_notify_status_change
  after update on public.claims
  for each row execute function public.notify_on_claim_status_change();

-- ─── Policies ────────────────────────────────────────

drop policy if exists "Users can view own family members" on public.family_members;
create policy "Users can view own family members"
  on public.family_members for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own family members" on public.family_members;
create policy "Users can insert own family members"
  on public.family_members for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own family members" on public.family_members;
create policy "Users can update own family members"
  on public.family_members for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own family members" on public.family_members;
create policy "Users can delete own family members"
  on public.family_members for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments"
  on public.payments for select using (auth.uid() = user_id);
drop policy if exists "Admins can view all payments" on public.payments;
create policy "Admins can view all payments"
  on public.payments for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);
