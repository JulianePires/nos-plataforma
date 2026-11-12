-- Local only: `supabase db reset` runs this file; `db push` never does.
-- Sign in through magic link (Mailpit at http://127.0.0.1:54324); these users have no password.

-- GoTrue fails to scan NULL into these token columns, so they are set to empty strings.
insert into auth.users (
  instance_id, id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change
)
values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
   'admin@nos.local', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Admin Nós"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
   'equipe@nos.local', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Equipe Nós"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
   'cliente@nos.local', now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Cliente Teste"}',
   now(), now(), '', '', '', '');

-- Without an email identity the magic link sign-in does not find the user.
insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text, 'email',
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  now(), now(), now()
from auth.users u
where u.email in ('admin@nos.local', 'equipe@nos.local', 'cliente@nos.local');

update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-000000000001';
update public.profiles set role = 'team' where id = '00000000-0000-4000-8000-000000000002';
