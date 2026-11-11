# NOS-10 · Pendências pequenas da S0

**Sprint:** S0 (fechamento) · **Estimativa:** 1 h · **Branch:** `chore/s0-cleanup`

## Objetivo
Fechar as pendências pequenas levantadas nos cards da S0, para a S1 começar sem dívida herdada. Cada item tem origem rastreável.

## Contexto
- Os arquivos de cada item abaixo; `docs/specs/backlog.md` para o que não é da S0

## Referências (context7)
- turborepo (`inputs` de tarefa), supabase cli (`gen types`)

## Requisitos
| # | Item | Origem | Arquivo |
| --- | --- | --- | --- |
| 1 | Ignorar `apps/web/AGENTS.md` e `apps/web/CLAUDE.md`, gerados pelo `next dev` quando roda sob agente | NOS-3 | `apps/web/.gitignore` |
| 2 | Tirar `license` e `publishConfig` herdados do create-turbo (pacote é privado) | NOS-3 | `packages/typescript-config/package.json` |
| 3 | `typecheck` do Turbo declara `inputs` com `$TURBO_DEFAULT$` e `$TURBO_ROOT$/packages/*/src/**` (globs de `inputs` são relativos ao pacote; `$TURBO_ROOT$` ancora na raiz), para pacote novo não reaproveitar cache velho | NOS-4 | `turbo.json` |
| 4 | Comentário e mensagens do script em inglês (código em inglês, `CLAUDE.md`) | NOS-1 | `scripts/check-pr-size.sh`, `scripts/check-pr-size.test.sh` |
| 5 | `db:types` grava num arquivo temporário e só troca o arquivo final se a geração der certo | NOS-2 | `package.json` (+ script em `scripts/` se precisar) |
| 6 | Comandos do Supabase via `bunx supabase …` (a CLI é devDependency) | NOS-2 | `CLAUDE.md` |
| 7 | Estrutura do README sem `packages/eslint-config` (removido) e com `supabase/` atual | NOS-3 | `README.md` |
| 8 | Permissões: trocar `pnpm` por `bun` e tirar espaços sobrando (o bloqueio de `db push`/`link` via `bunx`/`npx` já entra antes, como pré-requisito do NOS-9) | NOS-2 / ADR 0003 | `.claude/settings.json` (**você edita**: o Claude não altera regras de permissão) |

## Fora de escopo
- Tudo o que está em `docs/specs/backlog.md` com sprint de destino (auth, domínio, publishable key).

## Cenários (BDD)
```gherkin
Funcionalidade: S0 sem pendência pequena

  Cenário: Arquivos de agente do Next não sujam a árvore
    Dado que o "next dev" gerou "apps/web/AGENTS.md"
    Quando eu rodo "git status"
    Então o arquivo não aparece

  Cenário: Geração de tipos que falha não apaga o arquivo
    Dado o banco local parado
    Quando eu rodo "bun run db:types"
    Então o comando falha e "packages/db/src/database.types.ts" continua igual

  Cenário: Mensagens do script em inglês
    Quando eu rodo "bash scripts/check-pr-size.test.sh"
    Então os 4 cenários passam com as mensagens novas

  Cenário: Permissões sem pnpm
    Quando eu leio ".claude/settings.json"
    Então nenhuma regra cita "pnpm" e o JSON é válido
```

## Critérios de aceite
- [x] Os 8 itens feitos, cada um citado no PR
- [x] `bun run lint && bun run typecheck && bun run test` verdes; `scripts/check-pr-size.test.sh` verde
- [x] `.claude/settings.json` é JSON válido e sem regra de `pnpm`

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Mensagens do script | script | `scripts/check-pr-size.test.sh` |
| `db:types` atômico, `.gitignore`, permissões | comando, evidência no PR | — |

## Limites
- Até 20 arquivos. Nenhuma dependência nova.
