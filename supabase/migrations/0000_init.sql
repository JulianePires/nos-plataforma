-- Empty on purpose: S0 only bootstraps the database; pgTAP backs the RLS isolation tests from S1 on.
-- pgTAP lives in `extensions`, not `public`, so its SQL-running helpers are not exposed by the Data API.
create extension if not exists pgtap with schema extensions;
