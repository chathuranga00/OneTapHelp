-- One Tap Help — initial schema (safe to re-run)
-- Supabase Dashboard → SQL Editor → Run

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  phone text not null,
  relation text,
  priority_order integer not null default 0
);

create table if not exists public.sos_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  triggered_at timestamptz not null default now(),
  latitude double precision,
  longitude double precision,
  audio_url text,
  status text not null default 'active',
  resolved_at timestamptz,
  constraint sos_events_status_check check (
    status in ('active', 'resolved', 'cancelled')
  )
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.users (id) on delete cascade,
  panic_phrase text,
  voice_trigger boolean not null default false,
  auto_call_police boolean not null default false,
  language text not null default 'en'
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists emergency_contacts_user_id_idx on public.emergency_contacts (user_id);
create index if not exists sos_events_user_id_idx on public.sos_events (user_id);
create index if not exists sos_events_triggered_at_idx on public.sos_events (triggered_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.sos_events enable row level security;
alter table public.user_settings enable row level security;

-- users
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_delete_own" on public.users;

create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users_delete_own"
  on public.users for delete
  using (auth.uid() = id);

-- emergency_contacts
drop policy if exists "emergency_contacts_select_own" on public.emergency_contacts;
drop policy if exists "emergency_contacts_insert_own" on public.emergency_contacts;
drop policy if exists "emergency_contacts_update_own" on public.emergency_contacts;
drop policy if exists "emergency_contacts_delete_own" on public.emergency_contacts;

create policy "emergency_contacts_select_own"
  on public.emergency_contacts for select
  using (auth.uid() = user_id);

create policy "emergency_contacts_insert_own"
  on public.emergency_contacts for insert
  with check (auth.uid() = user_id);

create policy "emergency_contacts_update_own"
  on public.emergency_contacts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "emergency_contacts_delete_own"
  on public.emergency_contacts for delete
  using (auth.uid() = user_id);

-- sos_events
drop policy if exists "sos_events_select_own" on public.sos_events;
drop policy if exists "sos_events_insert_own" on public.sos_events;
drop policy if exists "sos_events_update_own" on public.sos_events;
drop policy if exists "sos_events_delete_own" on public.sos_events;

create policy "sos_events_select_own"
  on public.sos_events for select
  using (auth.uid() = user_id);

create policy "sos_events_insert_own"
  on public.sos_events for insert
  with check (auth.uid() = user_id);

create policy "sos_events_update_own"
  on public.sos_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "sos_events_delete_own"
  on public.sos_events for delete
  using (auth.uid() = user_id);

-- user_settings
drop policy if exists "user_settings_select_own" on public.user_settings;
drop policy if exists "user_settings_insert_own" on public.user_settings;
drop policy if exists "user_settings_update_own" on public.user_settings;
drop policy if exists "user_settings_delete_own" on public.user_settings;

create policy "user_settings_select_own"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "user_settings_insert_own"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "user_settings_update_own"
  on public.user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_settings_delete_own"
  on public.user_settings for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create profile + settings on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.phone
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
