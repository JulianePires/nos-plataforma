# S0 · Sessões (9 a 15 de novembro)

São 10 cards em 4 sessões de cerca de 3 h: 6 de base e 4 de fechamento técnico (07 a 10), todos antes da S1. A ordem segue as dependências: repo → monorepo → CI → banco → deploy → UI. Em cada card, o ciclo é o mesmo: `/card` → você aprova → `/tdd` → `/review` → `/pr`. Entre cards, `/clear`.

Antes da sessão 1, faça à mão (o Claude não deve fazer isso):
- [ ] Criar o repo vazio `nos-plataforma` no GitHub e clonar
- [ ] Criar `nos-dev` e `nos-prod` no Supabase (região `sa-east-1`)
- [ ] Copiar o kit para o repo e seguir a instalação em `00-prompt-inicial.md`

---

## Sessão 1 · Base

**Prompt inicial** (só desta vez): o bloco de `00-prompt-inicial.md`.

**Card 01 · Repo e kit**
```text
/card docs/specs/S0/01-repo-e-kit.md
```
Depois do plano aprovado:
```text
/tdd
```
```text
/review
```
```text
/pr
```

**Card 02 · Monorepo**
```text
/clear
/card docs/specs/S0/02-monorepo-scaffold.md
```
Se ele propuser lib ou estrutura fora da spec, responda:
```text
Fora da spec. Fique no mínimo que faz os 3 cenários passarem. Se achar que falta algo, registre como sugestão no fim do /pr, não implemente.
```

---

## Sessão 2 · Qualidade e banco

**Card 03 · CI**
```text
/clear
/card docs/specs/S0/03-ci.md
```
Para provar os cenários de bloqueio sem sujar a `main`:
```text
Crie 3 branches de teste (erro de tipo, any explícito, 21 arquivos), abra PRs de rascunho pelo MCP github, confirme que o CI falha em cada uma e depois feche as PRs e apague as branches. Me mostre só o link de cada run.
```

**Card 04 · Supabase**
```text
/clear
/card docs/specs/S0/04-supabase.md
```
Se ele quiser aplicar algo no projeto remoto:
```text
Nada no remoto neste card. Só banco local via supabase CLI. O MCP do Supabase é só leitura.
```

---

## Sessão 3 · Deploy e UI

**Card 05 · Vercel**
```text
/clear
/card docs/specs/S0/05-vercel.md
```
```text
Use o MCP vercel para conferir a configuração, mas me mostre o que vai criar ou alterar e espere meu ok antes de cada escrita.
```

**Card 06 · Tokens do Seixu**
```text
/clear
/card docs/specs/S0/06-seixu-tokens.md
```
Se quiser conferir a referência visual:
```text
Use o MCP figma só para ler os tokens do arquivo Make 186t0PDVG4qObWpY6v4WUP (src/data/typography.ts e src/data/components.ts). A paleta NÃO vem do Figma: use os valores da spec, que já estão na direção arroxeada.
```

---

## Sessão 4 · Fechamento técnico (antes da S1)

Ordem: 09 → 10 → 07 → 08. O 09 vem primeiro porque é segurança e libera a primeira tabela da S1; o 08 vem por último porque reformata tudo o que os outros criaram.

**Card 09 · GRANT explícito na Data API** (ADR 0007)
```text
/clear
/card docs/specs/S0/09-api-grants.md
```
Você roda o `bunx supabase db push` em `nos-dev` e `nos-prod`; o Claude confere pelo MCP em `read_only`.

**Card 10 · Pendências pequenas**
```text
/clear
/card docs/specs/S0/10-chores.md
```
O item de permissões (`.claude/settings.json`) é editado por você.

**Card 07 · Changesets**
```text
/clear
/card docs/specs/S0/07-changesets.md
```

**Card 08 · Biome**
```text
/clear
/card docs/specs/S0/08-biome.md
```

---

## Fechamento da sprint

A S0 só fecha com todos os itens abaixo marcados. O que não for da S0 está em `docs/specs/backlog.md`, com sprint de destino.

- [ ] Cards 01 a 10 com todos os critérios de aceite marcados na spec
- [ ] Nenhuma PR aberta e nenhuma branch além da `main` (local e remota)
- [ ] ADRs 0001 a 0007 com status Aceita (0006 passa a Aceita no card 08)
- [ ] `main` verde: `ci` no último commit e deploy de produção `READY`
- [ ] `bun install --frozen-lockfile && bun run lint && bun run typecheck && bun run test` verdes num clone limpo
- [ ] `bunx supabase db reset && bunx supabase test db` verdes; `nos-dev` e `nos-prod` com as mesmas migrations
- [ ] `CLAUDE.md`, `README.md` e `docs/context/INDEX.md` sem comando, pasta ou ferramenta que não exista mais

```text
/clear
Leia `git log --oneline main` desta semana, os critérios de aceite das specs em docs/specs/S0/ e o checklist de fechamento em docs/prompts/S0-sessoes.md. Me diga em até 10 linhas o que fechou, o que ficou pendente e confirme que todo item fora da S0 está em docs/specs/backlog.md. Não abra código.
```
Depois, mova os cards no quadro do Notion.

## Frases úteis no meio do caminho
| Situação | Diga |
| --- | --- |
| Ele começou a codar sem plano | `Pare. Volte ao /card e espere aprovação.` |
| Abstração demais | `Isso tem um uso só. Inline e remova a abstração.` |
| Comentário inútil | `Remova comentários que só repetem o código.` |
| Duplicou algo | `Já existe <arquivo>. Reutilize e apague a cópia.` |
| PR passou de 20 arquivos | `Divida em duas PRs pela fronteira <x>. Me proponha os dois conjuntos.` |
| Contexto pesado | `/compact mantenha o plano aprovado e os cenários que faltam` |
| Dúvida sobre uma lib | `Consulte o context7 para <lib> e cite o trecho.` |
