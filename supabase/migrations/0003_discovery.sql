create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint blocks_no_self check (blocker_id <> blocked_id),
  constraint blocks_unique_pair unique (blocker_id, blocked_id)
);

create index if not exists blocks_blocker_idx on public.blocks (blocker_id);
create index if not exists blocks_blocked_idx on public.blocks (blocked_id);

alter table public.blocks enable row level security;

drop policy if exists "Users can read their own blocks" on public.blocks;
create policy "Users can read their own blocks"
on public.blocks for select
to authenticated
using (blocker_id = auth.uid() or blocked_id = auth.uid());

drop policy if exists "Users can insert their own blocks" on public.blocks;
create policy "Users can insert their own blocks"
on public.blocks for insert
to authenticated
with check (blocker_id = auth.uid());

drop policy if exists "Users can delete their own blocks" on public.blocks;
create policy "Users can delete their own blocks"
on public.blocks for delete
to authenticated
using (blocker_id = auth.uid());

create or replace function public.get_discoverable_profiles()
returns table (
  id uuid,
  username text,
  age integer,
  avatar_url text,
  bio text,
  languages text[],
  interests text[],
  travel_type travel_type,
  approx_area text,
  current_intent current_intent,
  visible_until timestamptz,
  remaining_seconds integer
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.age,
    p.avatar_url,
    coalesce(p.bio, '') as bio,
    coalesce(p.languages, '{}') as languages,
    coalesce(p.interests, '{}') as interests,
    p.travel_type,
    p.approx_area,
    v.intent as current_intent,
    v.visible_until,
    greatest(0, floor(extract(epoch from (v.visible_until - now()))))::integer as remaining_seconds
  from public.profiles p
  join lateral (
    select vs.intent, vs.visible_until
    from public.visibility_sessions vs
    where vs.user_id = p.id
      and vs.ended_at is null
      and vs.visible_until > now()
    order by vs.created_at desc
    limit 1
  ) v on true
  where p.id <> auth.uid()
    and p.deleted_at is null
    and p.is_suspended = false
    and exists (
      select 1
      from public.profiles me
      where me.id = auth.uid()
        and me.deleted_at is null
        and me.is_suspended = false
        and me.approx_area = p.approx_area
    )
    and not exists (
      select 1
      from public.blocks b
      where (b.blocker_id = auth.uid() and b.blocked_id = p.id)
         or (b.blocker_id = p.id and b.blocked_id = auth.uid())
    )
  order by v.visible_until asc, p.username asc;
$$;

grant execute on function public.get_discoverable_profiles() to authenticated;

