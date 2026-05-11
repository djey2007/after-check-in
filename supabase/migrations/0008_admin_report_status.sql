create or replace function public.admin_set_report_status(report_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'not allowed';
  end if;

  if new_status not in ('reviewed', 'dismissed') then
    raise exception 'invalid report status';
  end if;

  update public.reports
  set
    status = new_status,
    reviewed_at = now()
  where id = report_id;
end;
$$;

grant execute on function public.admin_set_report_status(uuid, text) to authenticated;
