# 0007 · Tabela nova só entra na API com GRANT explícito

**Status:** Aceita · **Data:** 2026-11-11

## Contexto
Por padrão, toda tabela, view ou função criada em `public` fica acessível às roles da API (`anon`, `authenticated`) sem GRANT. Uma migration que esqueça a RLS expõe os dados na hora. O isolamento entre clientes é regra não negociável (ADR 0001).

## Decisão
- `supabase/config.toml` define `[api] auto_expose_new_tables = false`: objeto novo em `public` nasce sem acesso pela API.
- Toda migration que cria tabela faz, nesta ordem: `enable row level security`, as policies e o `grant` explícito só para a role e as operações que a tela usa.
- O teste pgTAP do isolamento cobre também a role sem GRANT (deve falhar ao ler).
- Extensões ficam fora de `public` (`with schema extensions`); pgTAP não aparece na API nem nos tipos gerados.
- O `config.toml` só vale para o banco local. Antes da primeira tabela da S1, `nos-dev` e `nos-prod` precisam do mesmo comportamento (configuração da Data API no painel ou `alter default privileges ... revoke` numa migration); isso é o card NOS-9 (`docs/specs/S0/09-api-grants.md`).

## Alternativas descartadas
- Manter o padrão (`true`) e confiar na RLS: um esquecimento de `enable row level security` vira vazamento imediato.
- Criar as tabelas num schema não exposto e publicar views: mais seguro, mas dobra o número de objetos para um dev solo manter.

## Consequências
- Esquecer o GRANT quebra a tela (erro de permissão), em vez de vazar dados: falha segura.
- Cada migration fica um pouco maior; o `/review` confere a tripla RLS + policy + GRANT.

## Fonte
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/extensions
