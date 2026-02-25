-- Drop old utenti table if it exists
drop table if exists public.utenti cascade;

-- Create profiles table (optional user data)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);
  
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);
  
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- Create entitlements table (required for tracking purchases)
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null check (product in ('audit', 'diagnosi')),
  status text not null default 'active',
  paid_at timestamptz not null default now(),
  stripe_session_id text,
  created_at timestamptz default now() not null
);

alter table public.entitlements enable row level security;

create policy "entitlements_select_own" on public.entitlements 
  for select using (auth.uid() = user_id);
  
create policy "entitlements_insert_own" on public.entitlements 
  for insert with check (auth.uid() = user_id);

-- Create audit_reports table
create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.audit_reports enable row level security;

create policy "audit_reports_select_own" on public.audit_reports 
  for select using (auth.uid() = user_id);
  
create policy "audit_reports_insert_own" on public.audit_reports 
  for insert with check (auth.uid() = user_id);
  
create policy "audit_reports_update_own" on public.audit_reports 
  for update using (auth.uid() = user_id);

-- Create diagnosi_reports table
create table if not exists public.diagnosi_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.diagnosi_reports enable row level security;

create policy "diagnosi_reports_select_own" on public.diagnosi_reports 
  for select using (auth.uid() = user_id);
  
create policy "diagnosi_reports_insert_own" on public.diagnosi_reports 
  for insert with check (auth.uid() = user_id);
  
create policy "diagnosi_reports_update_own" on public.diagnosi_reports 
  for update using (auth.uid() = user_id);

-- Auto-create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', null),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Update function for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at on reports
create trigger audit_reports_updated_at
  before update on public.audit_reports
  for each row
  execute function public.handle_updated_at();

create trigger diagnosi_reports_updated_at
  before update on public.diagnosi_reports
  for each row
  execute function public.handle_updated_at();
