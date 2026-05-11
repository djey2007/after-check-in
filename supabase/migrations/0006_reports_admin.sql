create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint reports_no_self check (reporter_id <> reported_id),
  constraint reports_reason_check check (
    reason in ('inappropriate_behavior', 'harassment', 'fake_profile', 'offensive_content', 'other')
  ),
  constraint reports_status_check check (status in ('open', 'reviewed', 'dismissed')),
  constraint reports_details_length check (char_length(coalesce(details, '')) <= 500)
);

create index if not exists reports_reporter_idx on public.reports (reporter_id);
create index if not exists reports_reported_idx on public.reports (reported_id);
create index if not exists reports_status_created_idx on public.reports (status, created_at);

alter table public.reports enable row level security;

drop policy if exists "Users can create reports" on public.reports;
create policy "Users can create reports"
on public.reports for insert
to authenticated
with check (
  reporter_id = auth.uid()
  and reporter_id <> reported_id
);

drop policy if exists "Users can read their own reports" on public.reports;
create policy "Users can read their own reports"
on public.reports for select
to authenticated
using (reporter_id = auth.uid());

create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
      and p.deleted_at is null
  );
$$;

create or replace function public.get_admin_reports()
returns table (
  id uuid,
  reporter_id uuid,
  reported_id uuid,
  reporter_username text,
  reported_username text,
  reason text,
  details text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.id,
    r.reporter_id,
    r.reported_id,
    reporter.username as reporter_username,
    reported.username as reported_username,
    r.reason,
    coalesce(r.details, '') as details,
    r.status,
    r.created_at
  from public.reports r
  join public.profiles reporter on reporter.id = r.reporter_id
  join public.profiles reported on reported.id = r.reported_id
  where public.is_current_user_admin()
  order by r.created_at desc;
$$;

create or replace function public.get_admin_users()
returns table (
  id uuid,
  username text,
  age integer,
  approx_area text,
  is_admin boolean,
  is_suspended boolean,
  deleted_at timestamptz,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.age,
    p.approx_area,
    p.is_admin,
    p.is_suspended,
    p.deleted_at,
    p.created_at
  from public.profiles p
  where public.is_current_user_admin()
  order by p.created_at desc;
$$;

create or replace function public.admin_set_user_suspended(target_user_id uuid, suspended boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'not allowed';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'admins cannot suspend themselves';
  end if;

  update public.profiles
  set is_suspended = suspended
  where id = target_user_id;
end;
$$;

grant execute on function public.is_current_user_admin() to authenticated;
grant execute on function public.get_admin_reports() to authenticated;
grant execute on function public.get_admin_users() to authenticated;
grant execute on function public.admin_set_user_suspended(uuid, boolean) to authenticated;
