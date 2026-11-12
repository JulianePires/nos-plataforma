begin;
select plan(12);

insert into auth.users (id, email, raw_user_meta_data)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ana@test.local', '{"full_name": "Ana"}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bruno@test.local', '{"name": "Bruno"}');

select results_eq(
  $$select full_name, role::text from public.profiles
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  $$values ('Ana', 'client')$$,
  'a new auth user gets a client profile with the same id and full_name'
);

select results_eq(
  $$select full_name from public.profiles
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$,
  $$values ('Bruno')$$,
  'full_name falls back to the "name" metadata key'
);

set local role authenticated;
set local request.jwt.claims = '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

select results_eq(
  $$select id from public.profiles$$,
  $$values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid)$$,
  'a user reads only their own profile'
);

select throws_ok(
  $$update public.profiles set role = 'admin'
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '42501',
  null,
  'a user cannot change their own role'
);

select results_eq(
  $$update public.profiles set full_name = 'Ana Maria'
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    returning full_name$$,
  $$values ('Ana Maria')$$,
  'a user updates their own full_name'
);

select is_empty(
  $$update public.profiles set full_name = 'hacked'
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    returning id$$,
  'a user cannot update another profile'
);

reset role;
select results_eq(
  $$select full_name, role::text from public.profiles
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$,
  $$values ('Bruno', 'client')$$,
  'the other profile is left intact'
);

set local role authenticated;
select throws_ok(
  $$insert into public.profiles (id) values ('cccccccc-cccc-cccc-cccc-cccccccccccc')$$,
  '42501',
  null,
  'a user cannot insert profiles through the API'
);

select throws_ok(
  $$delete from public.profiles where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '42501',
  null,
  'a user cannot delete profiles through the API'
);

set local role anon;
select throws_ok(
  $$select * from public.profiles$$,
  '42501',
  null,
  'anon cannot read profiles (no grant)'
);

reset role;
select ok(
  not has_function_privilege('anon', 'private.handle_new_user()', 'execute'),
  'anon cannot execute the trigger function'
);
select ok(
  not has_function_privilege('authenticated', 'private.handle_new_user()', 'execute'),
  'authenticated cannot execute the trigger function'
);

select * from finish();
rollback;
