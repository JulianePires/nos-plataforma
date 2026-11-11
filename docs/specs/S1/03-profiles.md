# NOS-14 · Tabela `profiles`, papéis e seed local

**Sprint:** S1 · **Estimativa:** 1,5 h · **Branch:** `feat/s1-profiles`

## Objetivo
Todo usuário do Auth tem um `profile` com papel global (`admin`, `team` ou `client`), visível só para ele, e o banco local sobe com três usuários de teste.

## Contexto (o Claude lê só isto)
- `supabase/migrations/` (as 2 últimas), `supabase/tests/0001_default_privileges.test.sql`, `supabase/config.toml` (só `[db.seed]`)
- `docs/adr/0007-explicit-data-api-grants.md`, `packages/db/src/index.ts`

## Referências (context7)
- supabase (trigger em `auth.users`, `security definer`, RLS com `auth.uid()`), pgtap

## Requisitos
- Migration: enum `public.app_role` (`admin`, `team`, `client`) e tabela `public.profiles` (`id` = `auth.users.id` com `on delete cascade`, `full_name`, `role` default `client`, `created_at`).
- Na mesma migration, na ordem do ADR 0007: `enable row level security`, policies, GRANT explícito.
  - `select`: só a própria linha (`id = (select auth.uid())`).
  - `update`: só a própria linha, e só a coluna `full_name` (`grant update (full_name)`). Ninguém muda o próprio `role` pela API.
  - Sem `insert` e sem `delete` pela API.
- Trigger `after insert on auth.users` cria o profile com `full_name` vindo de `raw_user_meta_data` (`full_name` ou `name`). A função fica num schema `private`, sem exposição na API, `security definer` com `search_path` vazio.
- `supabase/seed.sql` (só local): 3 usuários com e-mail confirmado (`admin@nos.local`, `equipe@nos.local`, `cliente@nos.local`) e os papéis correspondentes.
- `bun run db:types` regenera `packages/db/src/database.types.ts`; changeset para `@nos/db`.
- ADR 0010 "Autenticação e papéis": magic link para clientes, Google para a equipe (card 07), papel padrão `client`, promoção só por SQL no painel do `nos-prod` (sem tela), autorização nos layouts com `getClaims()` + `profiles.role`.

## Fora de escopo
- Ler o profile de outra pessoa (equipe vendo clientes): entra com `project_members` na S2.
- Tela de perfil.

## Cenários (BDD)
```gherkin
Funcionalidade: Perfil e papel de cada usuário

  Cenário: Usuário novo ganha perfil de cliente
    Quando um usuário é criado no Auth com "full_name" = "Ana"
    Então existe um profile com o mesmo id, nome "Ana" e papel "client"

  Cenário: Usuário só lê o próprio perfil
    Dado os usuários A e B
    Quando A consulta "profiles"
    Então só a linha de A volta

  Cenário: Ninguém se promove
    Dado o usuário A com papel "client"
    Quando A tenta atualizar a própria coluna "role" para "admin"
    Então a atualização é negada

  Cenário: Nome pode ser editado
    Quando A atualiza o próprio "full_name"
    Então a atualização passa

  Cenário: Anônimo não lê nada
    Quando "anon" consulta "profiles"
    Então a consulta é negada por falta de GRANT

  Cenário: Função do trigger fora da API
    Então "anon" e "authenticated" não têm "execute" na função do trigger
```

## Critérios de aceite
- [ ] `bunx supabase db reset && bunx supabase test db` verdes, local e no job `db`
- [ ] Você aplica a migration no `nos-prod` (`db push`) e promove o seu usuário a `admin` por SQL
- [ ] ADR 0010 com status Aceita

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Todos os cenários | pgTAP (com `set local role` e `request.jwt.claims`) | `supabase/tests/0002_profiles.test.sql` |

## Limites
- Até 10 arquivos (os tipos gerados não contam). Nenhuma dependência nova.
