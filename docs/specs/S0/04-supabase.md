# NOS-2 · Supabase local, dev e prod

**Sprint:** S0 · **Estimativa:** 1,5 h · **Branch:** `chore/s0-supabase`

## Objetivo
O Supabase roda localmente, os projetos `nos-dev` e `nos-prod` existem, e os tipos do banco são gerados em `packages/db`.

> Atualização (NOS-11, ADR 0009): o `nos-dev` hospedado saiu. O dev é o Supabase local em Docker, e o MCP aponta para o `nos-prod` em `read_only`.

## Contexto
- `docs/adr/0001-stack.md`, `packages/db/`

## Referências (context7)
- supabase cli (init, start, gen types), @supabase/ssr com next.js app router

## Requisitos
- Você cria `nos-dev` e `nos-prod` no painel do Supabase (região São Paulo, `sa-east-1`).
- `supabase init` na raiz; `supabase/config.toml` versionado.
- Migration inicial vazia de propósito (`0000_init.sql` só com `create extension if not exists pgtap`).
- Script `bun run db:types` que gera `packages/db/src/database.types.ts` a partir do banco local.
- `apps/web/lib/supabase/{server,client}.ts` com `@supabase/ssr`, lendo `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` validadas por Zod em `lib/env.ts`.
- `.env.example` atualizado com as variáveis novas.

## Fora de escopo
- Tabelas, auth e RLS (S1 e S2).

## Cenários (BDD)
```gherkin
Funcionalidade: Banco disponível para o app

  Cenário: Banco local sobe do zero
    Dado o Docker rodando
    Quando eu rodo "supabase start" e "supabase db reset"
    Então a migration inicial é aplicada sem erro

  Cenário: Variável de ambiente faltando
    Dado que "NEXT_PUBLIC_SUPABASE_URL" não está definida
    Quando o app inicia
    Então ele falha com uma mensagem que nomeia a variável

  Cenário: Tipos gerados
    Quando eu rodo "bun run db:types"
    Então "packages/db/src/database.types.ts" é recriado e "bun run typecheck" passa
```

## Critérios de aceite
- [x] `lib/env.ts` com teste unitário para variável ausente
- [x] Nenhuma chave `service_role` no código do app
- [x] MCP do Supabase apontando para `nos-dev` em `read_only`

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Variável faltando | unit (Vitest) | `apps/web/lib/env.test.ts` |
| Banco local / tipos | comando, evidência no PR | — |

## Limites
- Até 20 arquivos (tipos gerados não contam). Dependências: @supabase/supabase-js, @supabase/ssr, zod, supabase (dev).
