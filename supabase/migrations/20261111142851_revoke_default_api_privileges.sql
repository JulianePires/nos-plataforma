-- ADR 0007: new objects created by migrations (owner: postgres) reach the Data API only via explicit GRANT.
-- Mirrors `auto_expose_new_tables = false` on hosted projects, which do not read config.toml.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated, service_role;

-- Global on purpose: PUBLIC's execute on functions is a global default that a per-schema revoke cannot remove.
-- Every function postgres creates, in any schema, now needs an explicit grant execute.
alter default privileges for role postgres
  revoke execute on functions from public;
