do $$
begin
  if not exists (select 1 from pg_type where typname = 'contact_request_status') then
    create type contact_request_status as enum ('pending', 'accepted', 'declined', 'cancelled');
  end if;
end;
$$;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  status contact_request_status not null default 'pending',
  message text default '',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint contact_requests_no_self check (sender_id <> receiver_id),
  constraint contact_requests_message_length check (char_length(coalesce(message, '')) <= 240)
);

create unique index if not exists contact_requests_unique_active_idx
on public.contact_requests (least(sender_id, receiver_id), greatest(sender_id, receiver_id))
where status in ('pending', 'accepted');

create index if not exists contact_requests_sender_idx on public.contact_requests (sender_id);
create index if not exists contact_requests_receiver_idx on public.contact_requests (receiver_id);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid not null unique references public.contact_requests(id) on delete cascade,
  participant_a uuid not null references public.profiles(id) on delete cascade,
  participant_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint conversations_no_self check (participant_a <> participant_b)
);

create index if not exists conversations_participant_a_idx on public.conversations (participant_a);
create index if not exists conversations_participant_b_idx on public.conversations (participant_b);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint messages_body_length check (char_length(body) between 1 and 2000)
);

create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at);

alter table public.contact_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Connected users can read contact profiles" on public.profiles;
create policy "Connected users can read contact profiles"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.contact_requests cr
    where (cr.sender_id = auth.uid() and cr.receiver_id = profiles.id)
       or (cr.receiver_id = auth.uid() and cr.sender_id = profiles.id)
  )
);

drop policy if exists "Participants can read contact requests" on public.contact_requests;
create policy "Participants can read contact requests"
on public.contact_requests for select
to authenticated
using (sender_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists "Users can send contact requests" on public.contact_requests;
create policy "Users can send contact requests"
on public.contact_requests for insert
to authenticated
with check (
  sender_id = auth.uid()
  and sender_id <> receiver_id
  and status = 'pending'
  and not exists (
    select 1
    from public.blocks b
    where (b.blocker_id = sender_id and b.blocked_id = receiver_id)
       or (b.blocker_id = receiver_id and b.blocked_id = sender_id)
  )
);

drop policy if exists "Receivers can respond to contact requests" on public.contact_requests;
create policy "Receivers can respond to contact requests"
on public.contact_requests for update
to authenticated
using (receiver_id = auth.uid() and status = 'pending')
with check (receiver_id = auth.uid());

drop policy if exists "Participants can read conversations" on public.conversations;
create policy "Participants can read conversations"
on public.conversations for select
to authenticated
using (participant_a = auth.uid() or participant_b = auth.uid());

drop policy if exists "Participants can create accepted conversations" on public.conversations;
create policy "Participants can create accepted conversations"
on public.conversations for insert
to authenticated
with check (
  (participant_a = auth.uid() or participant_b = auth.uid())
  and exists (
    select 1
    from public.contact_requests cr
    where cr.id = contact_request_id
      and cr.status = 'accepted'
      and least(cr.sender_id, cr.receiver_id) = least(participant_a, participant_b)
      and greatest(cr.sender_id, cr.receiver_id) = greatest(participant_a, participant_b)
  )
);

drop policy if exists "Participants can read messages" on public.messages;
create policy "Participants can read messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  )
);

drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
      and (sender_id = c.participant_a or sender_id = c.participant_b)
      and not exists (
        select 1
        from public.blocks b
        where (b.blocker_id = c.participant_a and b.blocked_id = c.participant_b)
           or (b.blocker_id = c.participant_b and b.blocked_id = c.participant_a)
      )
  )
);
