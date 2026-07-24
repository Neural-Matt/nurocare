-- =====================================================
-- Security patch — run this against a project that has
-- already had the original schema.sql applied.
-- Safe to re-run (idempotent).
-- =====================================================

-- ─── claims.amount must be positive ───────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'claims_amount_check'
  ) then
    alter table public.claims add constraint claims_amount_check check (amount > 0);
  end if;
end $$;

-- ─── Prevent self-promotion to admin ──────────────────
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

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ─── Prevent subscription self-tampering ──────────────
create or replace function public.restrict_subscription_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_admin boolean;
begin
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

drop trigger if exists subscriptions_restrict_self_update on public.subscriptions;
create trigger subscriptions_restrict_self_update
  before update on public.subscriptions
  for each row execute function public.restrict_subscription_self_update();

-- ─── Tighten claims insert (force status='submitted') ─
drop policy if exists "Users can insert own claims" on public.claims;
create policy "Users can insert own claims"
  on public.claims for insert
  with check (auth.uid() = user_id and status = 'submitted');
