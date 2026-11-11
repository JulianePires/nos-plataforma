# NOS-9 · GRANT explícito na Data API em todos os ambientes

**Sprint:** S0 (fechamento) · **Estimativa:** 1 h · **Branch:** `chore/s0-api-grants`

## Objetivo
No banco local (Docker) e no `nos-prod`, tabela, view, sequence ou função nova em `public` nasce sem acesso para `anon` e `authenticated`. Só entra na API com GRANT explícito na migration (ADR 0007).

## Contexto
- `docs/adr/0007-explicit-data-api-grants.md`, `supabase/config.toml`, `supabase/migrations/`
- `CLAUDE.md` (Banco e segurança)

## Referências (context7)
- supabase (Data API, default privileges, `supabase link`, `supabase db push`), postgres (`alter default privileges`), pgtap

## Requisitos
- **Pré-requisito (você, antes de começar):** em `.claude/settings.json`, negar `Bash(bunx supabase db push:*)`, `Bash(npx supabase db push:*)`, `Bash(bunx supabase link:*)` e `Bash(npx supabase link:*)`, além dos que já existem. Regra de permissão casa por prefixo de comando e não cobre toda forma de chamar a CLI; a garantia real é que o Claude nunca roda `supabase link`, então `db push` não tem projeto alvo.
- Migration `<timestamp>_revoke_default_api_privileges.sql`, com **um `alter default privileges` por classe de objeto** (o Postgres aceita uma só por `on`):
  - `on tables` e `on sequences`: `revoke all … from anon, authenticated, service_role`
  - `on functions`: `revoke all … from anon, authenticated, service_role` em `public`, e `revoke execute … from public` **global** (sem `in schema`): função nova ganha `execute` para `public` por um padrão global, que um revoke por schema não remove, e as roles da API herdam dele
  - Vale para local e para os projetos hospedados, sem depender do painel, e deixa `service_role` igual ao comportamento local do `auto_expose_new_tables = false`.
- Teste pgTAP em `supabase/tests/0001_default_privileges.test.sql`, dentro de uma transação: tabela nova sem `select` para `anon`, `authenticated` e `service_role`; função nova sem `execute` para essas roles; `grant` explícito libera só o que foi concedido.
- O ambiente de dev é o Supabase local em Docker (`supabase start`). Não há projeto `nos-dev` hospedado por causa do limite de projetos do plano gratuito. A migration chega ao local por `bunx supabase db reset`.
- Você aplica a migration no `nos-prod`: `bunx supabase link` + `bunx supabase db push --remote` (na CLI 3.x, sem `--remote` o push vai para o banco local). O Claude só confere pelo MCP em `read_only`.
- Conferência no `nos-prod` pelo MCP do Supabase (o banco local é conferido pelo pgTAP): `pg_default_acl` de `public` sem `anon`/`authenticated`/`service_role`, e sem `execute` padrão para `public` em funções.
- ADR 0007: a pendência dos projetos hospedados sai das Decisões e vira fato, com a forma escolhida.

## Fora de escopo
- Tabelas, policies e auth (S1 e S2).
- pgTAP no CI (S1, conforme o NOS-4).

## Cenários (BDD)
```gherkin
Funcionalidade: Objeto novo fica fora da API

  Cenário: Tabela nova sem GRANT
    Dado o banco local com as migrations aplicadas
    Quando uma migration cria "public.probe" sem GRANT
    Então "anon" e "authenticated" não têm SELECT em "public.probe"

  Cenário: GRANT explícito libera só o concedido
    Dado "public.probe" com "grant select to authenticated"
    Então "authenticated" tem SELECT e não tem INSERT
    E "anon" continua sem SELECT

  Cenário: Função nova sem GRANT
    Dado o banco local com as migrations aplicadas
    Quando uma migration cria "public.probe_fn()" sem GRANT
    Então "anon", "authenticated" e "service_role" não têm EXECUTE em "public.probe_fn()"

  Cenário: Produção segue o mesmo padrão
    Dado a migration aplicada em "nos-prod"
    Quando eu consulto "pg_default_acl" do schema "public" para a role "postgres"
    Então não há privilégio padrão para "anon", "authenticated" nem "service_role"
```

## Critérios de aceite
- [x] Pré-requisito de permissões aplicado: `.claude/settings.json` válido e negando `db push` e `link` via `supabase`, `bunx` e `npx`
- [x] `bunx supabase test db` verde localmente com o teste novo
- [x] Migration aplicada em `nos-prod` (evidência: `bunx supabase migration list --remote`)
- [x] `nos-prod` conferido pelo MCP `read_only`
- [x] ADR 0007 atualizado

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Tabela nova, função nova, GRANT explícito | pgTAP | `supabase/tests/0001_default_privileges.test.sql` |
| Produção | consulta via MCP + `migration list`, evidência no PR | — |

## Limites
- Até 20 arquivos. Nenhuma dependência nova.
