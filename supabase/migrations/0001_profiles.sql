do $$
begin
  if not exists (select 1 from pg_type where typname = 'travel_type') then
    create type travel_type as enum ('business', 'personal', 'both');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  age integer not null check (age >= 18),
  avatar_url text,
  bio text default '',
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  travel_type travel_type not null default 'business',
  approx_area text not null,
  is_adult_confirmed boolean not null default true,
  is_admin boolean not null default false,
  is_suspended boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 2 and 32),
  constraint profiles_bio_length check (char_length(bio) <= 240),
  constraint profiles_area_length check (char_length(approx_area) between 2 and 80)
);

create index if not exists profiles_approx_area_idx on public.profiles (approx_area);
create index if not exists profiles_suspended_deleted_idx on public.profiles (is_suspended, deleted_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (
  id = auth.uid()
  and age >= 18
  and is_admin = false
  and is_suspended = false
  and deleted_at is null
);

drop policy if exists "Users can update safe fields on their own profile" on public.profiles;
create policy "Users can update safe fields on their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and age >= 18
  and is_admin = false
  and is_suspended = false
);
