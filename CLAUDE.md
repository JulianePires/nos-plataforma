# Nós Plataforma — regras para o Claude Code

Plataforma da Nós Tecnologia Desenvolvimento Criativo: console interno + portal do cliente.
Stack: Next.js (App Router) + Supabase (Auth, Postgres/RLS, Realtime, Storage) + Tailwind v4 + Seixu.
Monorepo Bun + Turborepo. Deploy na Vercel. Dev solo: 10 h/semana, 1 card = 1 PR.

## Idioma
- Converse comigo em português.
- Código, nomes, testes, commits, título e descrição de PR em inglês.
- Textos (specs, ADRs, READMEs, `docs/`) em português.

## Contexto sob demanda (economia de token)
- NÃO leia o repositório inteiro. Comece por `docs/context/INDEX.md`. Ele diz quais arquivos ler para cada tipo de tarefa.
- Leia só a spec do card atual (`docs/specs/<sprint>/<card>.md`) e os arquivos que ela lista.
- Para documentação de libs (Next.js, Supabase, Tailwind, dnd-kit), use o MCP **context7** em vez de achar pela memória ou abrir `node_modules`.
- Busque com `rg`/Grep antes de abrir arquivos grandes. Leia trechos, não arquivos inteiros.
- Exploração ampla ou revisão: delegue ao subagente (`reviewer`) para não encher o contexto principal.
- Respostas curtas: sem resumo do que já está no diff, sem repetir a spec.

## Fluxo obrigatório por card (SDD → BDD → TDD)
1. **Entender:** leia a spec. Se faltar algo que muda a implementação, PERGUNTE antes (no máximo 3 perguntas objetivas). Não invente requisito.
2. **Referências:** quando houver mais de um jeito de fazer, consulte context7 ou a doc oficial e cite a fonte em uma linha.
3. **Plano:** proponha o plano (arquivos tocados, testes, riscos) e ESPERE minha aprovação.
4. **BDD:** os cenários Gherkin da spec viram testes de aceitação (Vitest/Playwright/pgTAP).
5. **TDD:** red → green → refactor. Escreva o teste, veja falhar, implemente o mínimo, refatore.
6. **Autoanálise:** antes de dizer que terminou, rode `/review` e corrija o que ele apontar.
7. **Entrega:** rode `/pr` para gerar a mensagem de commit, o título e a descrição da PR.
Nunca diga "pronto" sem lint, typecheck e testes verdes e sem eu ter visto o diff.

## Limites de PR
- No máximo **20 arquivos alterados por PR**. Não contam: lockfile, `database.types.ts` e outros gerados, `.changeset/`, `README.md`, e arquivos de controle (`CLAUDE.md`, `docs/context/INDEX.md`, `.claude/`). Passou disso, pare e proponha como dividir.
- Uma PR = um card. Nada de "aproveitei e mudei X".

## Código
- Sem comentários óbvios. Comente só o **porquê** de algo não evidente (regra de negócio, workaround, decisão de segurança).
- Não duplique: antes de criar função ou componente, procure um existente (`rg`) e reutilize ou estenda.
- Padrões de projeto só quando resolvem duplicação ou variação real (regra de três). Composição antes de herança. Strategy para regras que variam (impostos), Adapter para serviços externos (Supabase, e-mail), Repository em `features/*/queries.ts`.
- Sem overengineering: nada de abstração "para o futuro", nada de lib nova sem justificar no plano, nada de config que ninguém pediu.
- TypeScript strict, sem `any`. Validação com Zod nas bordas (form, Server Action, route handler).
- Server Components por padrão; `"use client"` só com estado ou evento.
- Estrutura: `apps/web/features/<módulo>/{components,actions.ts,queries.ts,schema.ts}`.

## Banco e segurança (não negociável)
- Toda tabela nova nasce com RLS habilitada, policies e um teste pgTAP que prove o isolamento (cliente A não lê projeto B).
- Migrations só via `supabase/migrations`. Nunca altere o banco de produção pelo MCP; o MCP do Supabase roda em `read_only`.
- Segredos só em variável de ambiente. Nunca leia nem escreva `.env*`, exceto `.env.example` (só nomes de variáveis e valores fictícios), que deve ser atualizado quando o card criar uma variável nova.

## UI (Seixu)
- Tokens em `packages/seixu`. Nunca use cor literal em componente.
- Paleta: fundo escuro arroxeado; contraste em azul, roxo e marrom.
- **Nunca use fonte com serifa.** DM Sans (UI) + JetBrains Mono (dados/código).
- Acessível: foco visível, labels, contraste AA, zero violações axe *serious*.

## Documentar decisões
- Decisão de stack, schema, segurança ou padrão novo → ADR em `docs/adr/NNNN-titulo.md` (use `/adr`).
- Componente novo do Seixu → atualize `packages/seixu/README.md` (props, quando usar).
- Atualize `docs/context/INDEX.md` quando criar uma área nova do código.

## Comandos
- `bun run dev` · `bun run lint` · `bun run typecheck` · `bun run test` · `bun run test:e2e`
- `supabase start` · `supabase db reset` · `supabase test db`
- `scripts/check-pr-size.sh` (limite de 20 arquivos)

## Git
- Branch: `feat|fix|chore/<sprint>-<slug>` (ex.: `feat/s0-monorepo-scaffold`).
- Conventional Commits em inglês.
- Pacotes de `packages/*` são internos e não são publicados. Changesets ainda não está instalado (card NOS-7); até lá, não crie changeset.
