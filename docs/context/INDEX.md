# Índice de contexto

Mapa de "o que ler para cada tarefa". Funciona como o RAG do projeto: o Claude consulta este índice e abre só o que a tarefa precisa. Mantenha cada linha curta e atualize quando criar uma área nova.

| Tarefa | Leia | Docs externas (context7) |
| --- | --- | --- |
| Qualquer card | `CLAUDE.md`, a spec do card | — |
| Monorepo, scripts, build | `package.json`, `turbo.json` | turborepo, bun |
| Rotas e páginas | `apps/web/app/**/layout.tsx` do grupo afetado | next.js (app router) |
| Feature de um módulo | `apps/web/features/<módulo>/` | next.js server actions, zod |
| Banco, migrations, RLS | `supabase/migrations/` (só as últimas 2), `supabase/tests/` | supabase rls, pgtap |
| Tipos do banco | `packages/db/src/database.types.ts` (gerado, leia só a tabela) | supabase cli gen types |
| UI e tokens | `packages/seixu/src/tokens.css`, `packages/seixu/README.md` | tailwindcss v4 |
| CI | `.github/workflows/ci.yml` | github actions |
| Deploy e envs | `docs/adr/0001-stack.md` | vercel |
| Decisões passadas | `docs/adr/` (só os títulos; abra o ADR citado) | — |

## Fontes de verdade fora do repo
- Arquitetura: https://claude.ai/code/artifact/22b8ec3b-a73b-4c96-bab5-50957ab6a642
- Plano e sprints: https://claude.ai/artifact/EYiw6BCNMYdCbsyUobDFnb
- Protótipo (telas de referência): https://claude.ai/artifact/FqbbT8JkZb1Ef7NWFUHbxH
- Seixu (Figma Make): `186t0PDVG4qObWpY6v4WUP`, via MCP figma, só quando a spec pedir

## Não ler (gasta token e não ajuda)
`node_modules/`, `.next/`, `.turbo/`, `bun.lock`, `coverage/`, `*.snap`, migrations antigas que a tarefa não toca.
