-- Account deletion requests (Google Play compliance)
-- Deploy with: supabase db push (or run in SQL editor)

create extension if not exists pgcrypto;

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text not null,
  message text,
  token_hash text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'expired', 'cancelled')),
  locale text not null default 'da',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  completed_at timestamptz
);

create index if not exists account_deletion_requests_email_created_idx
  on public.account_deletion_requests (email_normalized, created_at desc);

create index if not exists account_deletion_requests_ip_created_idx
  on public.account_deletion_requests (ip_hash, created_at desc)
  where ip_hash is not null;

create index if not exists account_deletion_requests_status_idx
  on public.account_deletion_requests (status, expires_at);

alter table public.account_deletion_requests enable row level security;

-- No policies: only service role / edge functions access this table.

comment on table public.account_deletion_requests is
  'Pending and completed web account deletion requests (email verification required).';

-- Extend with your app tables as needed.
create or replace function public.delete_gymly_user_data(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Add DELETE statements for Gymly public tables here, e.g.:
  -- delete from public.profiles where id = p_user_id;
  -- delete from public.check_ins where user_id = p_user_id;
  -- delete from public.posts where user_id = p_user_id;
  null;
end;
$$;

revoke all on function public.delete_gymly_user_data(uuid) from public;
grant execute on function public.delete_gymly_user_data(uuid) to service_role;
