alter table public.profiles
add column if not exists location_cell text;

alter table public.visibility_sessions
add column if not exists location_cell text;

alter table public.profiles
drop constraint if exists profiles_location_cell_format;

alter table public.profiles
add constraint profiles_location_cell_format
check (location_cell is null or location_cell ~ '^cell_[0-9]{1,5}_[0-9]{1,5}$');

alter table public.visibility_sessions
drop constraint if exists visibility_sessions_location_cell_format;

alter table public.visibility_sessions
add constraint visibility_sessions_location_cell_format
check (location_cell is null or location_cell ~ '^cell_[0-9]{1,5}_[0-9]{1,5}$');

create index if not exists profiles_location_cell_idx on public.profiles (location_cell);
create index if not exists visibility_sessions_location_cell_active_idx
on public.visibility_sessions (location_cell, visible_until)
where ended_at is null and location_cell is not null;

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
    select vs.intent, vs.visible_until, vs.location_cell
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
        and (
          (
            me.location_cell is not null
            and v.location_cell is not null
            and me.location_cell = v.location_cell
          )
          or (
            (me.location_cell is null or v.location_cell is null)
            and me.approx_area = p.approx_area
          )
        )
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
