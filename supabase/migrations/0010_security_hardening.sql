-- MVP security hardening.
-- This migration is intentionally idempotent and keeps sensitive account fields
-- out of direct user-controlled updates.

drop policy if exists "Users can update safe fields on their own profile" on public.profiles;

create policy "Users can update safe fields on their own profile"
on public.profiles for update
to authenticated
using (
  id = auth.uid()
  and is_suspended = false
  and deleted_at is null
)
with check (
  id = auth.uid()
  and age >= 18
  and is_admin = false
  and is_suspended = false
  and deleted_at is null
  and is_adult_confirmed = true
);

revoke update on public.profiles from authenticated;
grant update (
  username,
  age,
  avatar_url,
  bio,
  languages,
  interests,
  travel_type,
  approx_area,
  location_cell
) on public.profiles to authenticated;

create or replace function public.soft_delete_current_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  deletion_time timestamptz := now();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.visibility_sessions
  set ended_at = deletion_time
  where user_id = current_user_id
    and ended_at is null;

  update public.profiles
  set
    deleted_at = deletion_time,
    is_suspended = true
  where id = current_user_id
    and deleted_at is null;

  if not found then
    raise exception 'Profile not found or already deleted';
  end if;
end;
$$;

revoke all on function public.soft_delete_current_user() from public;
grant execute on function public.soft_delete_current_user() to authenticated;

drop policy if exists "Users can send contact requests" on public.contact_requests;
drop policy if exists "Users cannot insert contact requests directly" on public.contact_requests;

create policy "Users cannot insert contact requests directly"
on public.contact_requests for insert
to authenticated
with check (false);

create or replace function public.send_contact_request(
  target_user_id uuid,
  message text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  sender_user_id uuid := auth.uid();
  clean_message text := trim(coalesce(message, ''));
  created_request_id uuid;
begin
  if sender_user_id is null then
    raise exception 'Authentication required';
  end if;

  if target_user_id is null or target_user_id = sender_user_id then
    raise exception 'Invalid recipient';
  end if;

  if char_length(clean_message) > 240 then
    raise exception 'Message too long';
  end if;

  if not exists (
    select 1
    from public.profiles sender_profile
    where sender_profile.id = sender_user_id
      and sender_profile.deleted_at is null
      and sender_profile.is_suspended = false
  ) then
    raise exception 'Sender profile is not available';
  end if;

  if not exists (
    select 1
    from public.profiles receiver_profile
    where receiver_profile.id = target_user_id
      and receiver_profile.deleted_at is null
      and receiver_profile.is_suspended = false
  ) then
    raise exception 'Recipient is not available';
  end if;

  if exists (
    select 1
    from public.blocks b
    where (b.blocker_id = sender_user_id and b.blocked_id = target_user_id)
       or (b.blocker_id = target_user_id and b.blocked_id = sender_user_id)
  ) then
    raise exception 'Contact is blocked';
  end if;

  if exists (
    select 1
    from public.contact_requests cr
    where cr.status in ('pending', 'accepted')
      and least(cr.sender_id, cr.receiver_id) = least(sender_user_id, target_user_id)
      and greatest(cr.sender_id, cr.receiver_id) = greatest(sender_user_id, target_user_id)
  ) then
    raise exception 'A contact request already exists';
  end if;

  if not exists (
    select 1
    from public.profiles sender_profile
    join public.profiles receiver_profile on receiver_profile.id = target_user_id
    join lateral (
      select vs.approx_area, vs.location_cell
      from public.visibility_sessions vs
      where vs.user_id = target_user_id
        and vs.ended_at is null
        and vs.visible_until > now()
      order by vs.created_at desc
      limit 1
    ) receiver_visibility on true
    where sender_profile.id = sender_user_id
      and sender_profile.deleted_at is null
      and sender_profile.is_suspended = false
      and receiver_profile.deleted_at is null
      and receiver_profile.is_suspended = false
      and (
        (
          sender_profile.location_cell is not null
          and receiver_visibility.location_cell is not null
          and sender_profile.location_cell = receiver_visibility.location_cell
        )
        or (
          (sender_profile.location_cell is null or receiver_visibility.location_cell is null)
          and sender_profile.approx_area = receiver_visibility.approx_area
        )
      )
  ) then
    raise exception 'Recipient is not discoverable from your current zone';
  end if;

  insert into public.contact_requests (
    sender_id,
    receiver_id,
    message,
    status
  )
  values (
    sender_user_id,
    target_user_id,
    clean_message,
    'pending'
  )
  returning id into created_request_id;

  return created_request_id;
end;
$$;

revoke all on function public.send_contact_request(uuid, text) from public;
grant execute on function public.send_contact_request(uuid, text) to authenticated;
