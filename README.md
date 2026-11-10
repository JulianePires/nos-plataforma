# Nós Plataforma

Console interno e portal do cliente da **Nós Tecnologia Desenvolvimento Criativo**: projetos, documentação, backlog, chat com o cliente, orçamentos em PDF, portfólio e base de conhecimento.

## Stack
Next.js 16 · Supabase (Auth, Postgres com RLS, Realtime, Storage) · Tailwind v4 · Seixu (design system próprio) · Turborepo · Bun

## Rodando localmente
```bash
bun install
cp .env.example .env.local   # preencha as variáveis
bun run dev                  # http://localhost:3000
```

| Comando | O que faz |
| --- | --- |
| `bun run dev` | Sobe o app em modo desenvolvimento |
| `bun run build` | Build de produção |
| `bun run lint` | ESLint em todos os workspaces |
| `bun run typecheck` | TypeScript em todos os workspaces |
| `bun run test` | Testes (Vitest) em todos os workspaces |
| `bash scripts/check-pr-size.sh` | Confere o limite de 20 arquivos por PR |

## Estrutura
```
apps/web/                 app Next.js (console, portal, vitrine)
packages/seixu/           tokens e componentes do Seixu
packages/pricing/         motor de orçamento (sem I/O)
packages/db/              tipos do banco e schemas Zod
packages/eslint-config/   config compartilhada de lint
packages/typescript-config/
supabase/                 migrations, policies e testes pgTAP
docs/                     ADRs, specs por sprint, índice de contexto
```
A estrutura acima é o alvo da sprint S0; o card 02 adapta o scaffold do create-turbo.

## Trabalhando com o Claude Code
- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)
- O que ler para cada tarefa: [`docs/context/INDEX.md`](docs/context/INDEX.md)
- Fluxo por card: `/card <spec>` → aprovar o plano → `/tdd` → `/review` → `/pr`
- Specs da sprint atual: [`docs/specs/S0/`](docs/specs/S0/)
- Decisões: [`docs/adr/`](docs/adr/)
