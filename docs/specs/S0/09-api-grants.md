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
- Migration `<timestamp>_revoke_default_api_privileges.sql` com `alter default privileges for role postgres in schema public revoke all on tables, sequences, functions from anon, authenticated`. Ela vale para local e para os projetos hospedados, sem depender de configuração no painel.
- Teste pgTAP em `supabase/tests/0001_default_privileges.test.sql`: cria uma tabela dentro da transação e prova que `anon` e `authenticated` não têm `select`, e que um `grant` explícito libera só o que foi concedido.
- Você aplica a migration nos projetos hospedados: `bunx supabase link` + `bunx supabase db push`, primeiro no `nos-dev`, depois no `nos-prod`. O Claude não roda `db push` (bloqueado por regra) e só confere pelo MCP em `read_only`.
- Conferência no `nos-dev` pelo MCP do Supabase: `pg_default_acl` de `public` sem `anon`/`authenticated`.
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

  Cenário: Projetos hospedados seguem o mesmo padrão
    Dado a migration aplicada em "nos-dev" e "nos-prod"
    Quando eu consulto "pg_default_acl" do schema "public"
    Então não há privilégio padrão para "anon" nem "authenticated"
```

## Critérios de aceite
- [ ] `bunx supabase test db` verde localmente com o teste novo
- [ ] Migration aplicada em `nos-dev` e `nos-prod` (evidência: `bunx supabase migration list --linked` de cada um)
- [ ] `nos-dev` conferido pelo MCP `read_only`
- [ ] ADR 0007 atualizado

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Tabela nova / GRANT explícito | pgTAP | `supabase/tests/0001_default_privileges.test.sql` |
| Projetos hospedados | consulta via MCP + `migration list`, evidência no PR | — |

## Limites
- Até 20 arquivos. Nenhuma dependência nova.
