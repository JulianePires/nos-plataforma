# 0007 · Tabela nova só entra na API com GRANT explícito

**Status:** Aceita · **Data:** 2026-11-11

## Contexto
Por padrão, toda tabela, view ou função criada em `public` fica acessível às roles da API (`anon`, `authenticated`) sem GRANT. Uma migration que esqueça a RLS expõe os dados na hora. O isolamento entre clientes é regra não negociável (ADR 0001).

## Decisão
- `supabase/config.toml` define `[api] auto_expose_new_tables = false`: objeto novo em `public` nasce sem acesso pela API.
- Toda migration que cria tabela faz, nesta ordem: `enable row level security`, as policies e o `grant` explícito só para a role e as operações que a tela usa.
- O teste pgTAP do isolamento cobre também a role sem GRANT (deve falhar ao ler).
- Extensões ficam fora de `public` (`with schema extensions`); pgTAP não aparece na API nem nos tipos gerados.
- O `config.toml` só vale para o banco local. O banco local (Docker, ambiente de dev) e o `nos-prod` recebem o mesmo comportamento pela migration `20261111142851_revoke_default_api_privileges.sql` (NOS-9), sem depender do painel:
  - `alter default privileges for role postgres in schema public revoke all` em tabelas, sequences e funções, para `anon`, `authenticated` e `service_role`. `for role postgres` porque é a role dona dos objetos criados pelas migrations.
  - `alter default privileges for role postgres revoke execute on functions from public`, **global**: o Postgres concede `execute` a `PUBLIC` por um padrão global, e um revoke limitado a um schema não o remove. Toda função criada pelo `postgres`, em qualquer schema (inclusive helpers de RLS), precisa de `grant execute` explícito.
  - As entradas de `pg_default_acl` do `supabase_admin` continuam concedendo às roles da API; o `postgres` não pode alterá-las, e o `supabase_admin` não se autentica pela Data API.
  - `supabase/tests/0001_default_privileges.test.sql` prova o comportamento.

## Alternativas descartadas
- Manter o padrão (`true`) e confiar na RLS: um esquecimento de `enable row level security` vira vazamento imediato.
- Criar as tabelas num schema não exposto e publicar views: mais seguro, mas dobra o número de objetos para um dev solo manter.

## Consequências
- Esquecer o GRANT quebra a tela (erro de permissão), em vez de vazar dados: falha segura.
- Cada migration fica um pouco maior; o `/review` confere a tripla RLS + policy + GRANT.

## Fonte
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/functions
- https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html
- https://supabase.com/docs/guides/database/extensions
