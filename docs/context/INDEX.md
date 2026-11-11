# Índice de contexto

Mapa de "o que ler para cada tarefa". Funciona como o RAG do projeto: o Claude consulta este índice e abre só o que a tarefa precisa. Mantenha cada linha curta e atualize quando criar uma área nova.

| Tarefa | Leia | Docs externas (context7) |
| --- | --- | --- |
| Qualquer card | `CLAUDE.md`, a spec do card | — |
| Monorepo, scripts, build | `package.json`, `turbo.json` | turborepo, bun |
| Rotas e páginas | `apps/web/app/**/layout.tsx` do grupo afetado | next.js (app router) |
| Env e clientes Supabase | `apps/web/lib/env.ts`, `apps/web/lib/supabase/`, `apps/web/instrumentation.ts` | supabase ssr, zod |
| Feature de um módulo | `apps/web/features/<módulo>/` | next.js server actions, zod |
| Banco, migrations, RLS | `supabase/migrations/` (só as últimas 2), `supabase/tests/`, `docs/adr/0007-explicit-data-api-grants.md` | supabase rls, pgtap |
| Tipos do banco | `packages/db/src/database.types.ts` (gerado, leia só a tabela) | supabase cli gen types |
| UI e tokens | `packages/seixu/src/tokens.css`, `packages/seixu/README.md` | tailwindcss v4 |
| CI e lint | `.github/workflows/ci.yml`, `eslint.config.mjs`, `docs/adr/0005-typescript-6-for-lint.md` | github actions, typescript-eslint |
| Deploy e envs | `docs/adr/0004-vercel-environments.md` | vercel |
| Backlog de outras sprints | `docs/specs/backlog.md` | — |
| Decisões passadas | `docs/adr/` (só os títulos; abra o ADR citado) | — |

## Fontes de verdade fora do repo
- Arquitetura: https://claude.ai/code/artifact/22b8ec3b-a73b-4c96-bab5-50957ab6a642
- Plano e sprints: https://claude.ai/artifact/EYiw6BCNMYdCbsyUobDFnb
- Protótipo (telas de referência): https://claude.ai/artifact/FqbbT8JkZb1Ef7NWFUHbxH
- Seixu (Figma Make): `186t0PDVG4qObWpY6v4WUP`, via MCP figma, só quando a spec pedir

## Não ler (gasta token e não ajuda)
`node_modules/`, `.next/`, `.turbo/`, `bun.lock`, `coverage/`, `*.snap`, migrations antigas que a tarefa não toca.
