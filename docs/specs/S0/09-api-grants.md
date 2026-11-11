# NOS-9 · GRANT explícito na Data API em todos os ambientes

**Sprint:** S0 (fechamento) · **Estimativa:** 1 h · **Branch:** `chore/s0-api-grants`

## Objetivo
Em local, `nos-dev` e `nos-prod`, tabela, view, sequence ou função nova em `public` nasce sem acesso para `anon` e `authenticated`. Só entra na API com GRANT explícito na migration (ADR 0007).

## Contexto
- `docs/adr/0007-explicit-data-api-grants.md`, `supabase/config.toml`, `supabase/migrations/`
- `CLAUDE.md` (Banco e segurança)

## Referências (context7)
- supabase (Data API, default privileges, `supabase link`, `supabase db push`), postgres (`alter default privileges`), pgtap

## Requisitos
- **Pré-requisito (você, antes de começar):** em `.claude/settings.json`, negar `Bash(bunx supabase db push:*)`, `Bash(npx supabase db push:*)`, `Bash(bunx supabase link:*)` e `Bash(npx supabase link:*)`, além dos que já existem. Regra de permissão casa por prefixo de comando e não cobre toda forma de chamar a CLI; a garantia real é que o Claude nunca roda `supabase link`, então `db push` não tem projeto alvo.
- Migration `<timestamp>_revoke_default_api_privileges.sql`, com **um `alter default privileges` por classe de objeto** (o Postgres aceita uma só por `on`):
  - `on tables` e `on sequences`: `revoke all … from anon, authenticated, service_role`
  - `on functions`: `revoke execute … from public, anon, authenticated, service_role` (função nova ganha `execute` para `public` por padrão, e as roles da API herdam)
  - Vale para local e para os projetos hospedados, sem depender do painel, e deixa `service_role` igual ao comportamento local do `auto_expose_new_tables = false`.
- Teste pgTAP em `supabase/tests/0001_default_privileges.test.sql`, dentro de uma transação: tabela nova sem `select` para `anon`, `authenticated` e `service_role`; função nova sem `execute` para essas roles; `grant` explícito libera só o que foi concedido.
- Você aplica a migration nos projetos hospedados: `bunx supabase link` + `bunx supabase db push`, primeiro no `nos-dev`, depois no `nos-prod`. O Claude só confere pelo MCP em `read_only`.
- Conferência no `nos-dev` pelo MCP do Supabase: `pg_default_acl` de `public` sem `anon`/`authenticated`/`service_role`, e sem `execute` padrão para `public` em funções.
- ADR 0007: a pendência "nos-dev e nos-prod" sai das Decisões e vira fato, com a forma escolhida.

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

  Cenário: Projetos hospedados seguem o mesmo padrão
    Dado a migration aplicada em "nos-dev" e "nos-prod"
    Quando eu consulto "pg_default_acl" do schema "public"
    Então não há privilégio padrão para "anon", "authenticated" nem "service_role"
```

## Critérios de aceite
- [ ] Pré-requisito de permissões aplicado: `.claude/settings.json` válido e negando `db push` e `link` via `supabase`, `bunx` e `npx`
- [ ] `bunx supabase test db` verde localmente com o teste novo
- [ ] Migration aplicada em `nos-dev` e `nos-prod` (evidência: `bunx supabase migration list --linked` de cada um)
- [ ] `nos-dev` conferido pelo MCP `read_only`
- [ ] ADR 0007 atualizado

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Tabela nova, função nova, GRANT explícito | pgTAP | `supabase/tests/0001_default_privileges.test.sql` |
| Projetos hospedados | consulta via MCP + `migration list`, evidência no PR | — |

## Limites
- Até 20 arquivos. Nenhuma dependência nova.
