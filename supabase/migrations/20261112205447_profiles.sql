create type public.app_role as enum ('admin', 'team', 'client');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.app_role not null default 'client',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own row"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles: update own row"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

grant select on public.profiles to authenticated;
-- Column-level grant: role is promoted only by SQL in the dashboard (ADR 0010), never through the API.
grant update (full_name) on public.profiles to authenticated;

-- Not in the Data API's exposed schemas: functions here are unreachable over HTTP.
create schema if not exists private;

-- security definer: the auth service inserts users as a role that holds no privilege on public.profiles.
create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
