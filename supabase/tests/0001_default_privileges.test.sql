begin;
select plan(9);

create table public.probe (id int);

select ok(not has_table_privilege('anon', 'public.probe', 'select'), 'anon has no select on a new table');
select ok(not has_table_privilege('authenticated', 'public.probe', 'select'), 'authenticated has no select on a new table');
select ok(not has_table_privilege('service_role', 'public.probe', 'select'), 'service_role has no select on a new table');

grant select on public.probe to authenticated;
grant select on public.probe to anon;

select ok(has_table_privilege('authenticated', 'public.probe', 'select'), 'explicit grant gives authenticated select');
select ok(not has_table_privilege('authenticated', 'public.probe', 'insert'), 'explicit grant does not give authenticated insert');
select ok(not has_table_privilege('anon', 'public.probe', 'select'), 'explicit grant to authenticated leaves anon without select');

create function public.probe_fn() returns int language sql as 'select 1';

select ok(not has_function_privilege('anon', 'public.probe_fn()', 'execute'), 'anon has no execute on a new function');
select ok(not has_function_privilege('authenticated', 'public.probe_fn()', 'execute'), 'authenticated has no execute on a new function');
select ok(not has_function_privilege('service_role', 'public.probe_fn()', 'execute'), 'service_role has no execute on a new function');

select * from finish();
rollback;
