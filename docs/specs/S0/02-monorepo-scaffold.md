# NOS-3 · Scaffold do monorepo

**Sprint:** S0 · **Estimativa:** 2 h · **Branch:** `feat/s0-monorepo-scaffold`

## Objetivo
`pnpm dev` sobe `apps/web` (Next.js) consumindo os pacotes vazios `seixu`, `pricing` e `db`.

## Contexto
- `CLAUDE.md`, `docs/adr/0001-stack.md`, `docs/context/INDEX.md`

## Referências (context7)
- turborepo (pnpm workspaces), next.js (create-next-app com App Router, TypeScript, src opcional), tailwindcss v4 com next

## Requisitos
- `pnpm-workspace.yaml` com `apps/*` e `packages/*`; `turbo.json` com tarefas `dev`, `build`, `lint`, `typecheck`, `test`.
- `apps/web`: Next.js App Router, TypeScript strict, Tailwind v4, grupos de rota vazios `(console)`, `(portal)`, `(public)` com uma página placeholder cada.
- `packages/seixu`, `packages/pricing`, `packages/db`: `package.json` + `src/index.ts` exportando algo mínimo e tipado.
- `tsconfig` base compartilhado (`packages/tsconfig` ou `tsconfig.base.json`, escolha o mais simples e justifique no plano).
- Versões exatas fixadas no `package.json` (sem `^`) e `packageManager` declarado.

## Fora de escopo
- ESLint e CI (card 03), Supabase (card 04), tokens reais (card 06), auth.

## Cenários (BDD)
```gherkin
Funcionalidade: Monorepo funcional

  Cenário: App sobe em desenvolvimento
    Dado que rodei "pnpm install"
    Quando eu rodo "pnpm dev"
    Então "http://localhost:3000" responde 200
    E a página mostra "Nós Console"

  Cenário: App importa um pacote interno
    Dado que "packages/pricing" exporta "PRICING_VERSION"
    Quando "apps/web" importa "PRICING_VERSION"
    Então "pnpm typecheck" passa sem erros

  Cenário: Build de produção
    Quando eu rodo "pnpm build"
    Então todas as tarefas terminam com sucesso
```

## Critérios de aceite
- [ ] `pnpm install && pnpm build` limpo, sem warnings de peer dependency
- [ ] As 3 rotas placeholder respondem: `/`, `/portal`, `/vitrine` (ou nomes propostos no plano)
- [ ] Nenhum arquivo de exemplo do create-next-app sobrando (logo, CSS de demo)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| App importa pacote | unit (Vitest) | `apps/web/tests/smoke.test.ts` |
| App sobe / build | comando, evidência no PR | — |

## Limites
- Até 20 arquivos (lockfile não conta). Dependências: next, react, react-dom, typescript, tailwindcss, @tailwindcss/postcss, turbo, vitest.
