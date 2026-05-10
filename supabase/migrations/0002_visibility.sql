do $$
begin
  if not exists (select 1 from pg_type where typname = 'current_intent') then
    create type current_intent as enum ('dinner', 'drink', 'networking', 'local_outing', 'meet');
  end if;
end
$$;

create table if not exists public.visibility_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  intent current_intent not null,
  approx_area text not null,
  visible_until timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists visibility_sessions_user_idx on public.visibility_sessions (user_id);
create index if not exists visibility_sessions_active_idx on public.visibility_sessions (approx_area, visible_until) where ended_at is null;

alter table public.visibility_sessions enable row level security;

drop policy if exists "Users can read their own visibility sessions" on public.visibility_sessions;
create policy "Users can read their own visibility sessions"
on public.visibility_sessions for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert their own visibility sessions" on public.visibility_sessions;
create policy "Users can insert their own visibility sessions"
on public.visibility_sessions for insert
to authenticated
with check (
  user_id = auth.uid()
  and visible_until > now()
  and ended_at is null
);

drop policy if exists "Users can update their own visibility sessions" on public.visibility_sessions;
create policy "Users can update their own visibility sessions"
on public.visibility_sessions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

