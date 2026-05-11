create or replace function public.get_my_blocked_users()
returns table (
  block_id uuid,
  blocked_id uuid,
  username text,
  approx_area text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    b.id as block_id,
    b.blocked_id,
    p.username,
    p.approx_area,
    b.created_at
  from public.blocks b
  join public.profiles p on p.id = b.blocked_id
  where b.blocker_id = auth.uid()
  order by b.created_at desc;
$$;

grant execute on function public.get_my_blocked_users() to authenticated;
