-- Empty on purpose: S0 only bootstraps the database; pgTAP backs the RLS isolation tests from S1 on.
create extension if not exists pgtap;
