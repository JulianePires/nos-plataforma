# NOS-16 · Acesso por área: console, portal e vitrine

**Sprint:** S1 · **Estimativa:** 1,5 h · **Branch:** `feat/s1-route-guards`

## Objetivo
Cada grupo de rota decide quem entra: o console é da equipe, o portal é de quem tem sessão, a vitrine e o login são públicos. Um cliente não abre o console nem digitando a URL.

## Contexto (o Claude lê só isto)
- `apps/web/app/(console)/`, `apps/web/app/(portal)/`, `apps/web/app/(public)/`, `apps/web/app/(auth)/`
- `apps/web/lib/supabase/server.ts`, `apps/web/features/auth/`, `docs/adr/0010-*.md`

## Referências (context7)
- next.js 16 (layouts, `redirect`, rotas dinâmicas), supabase ssr (`getClaims` no servidor)

## Requisitos
- Função pura `resolveAccess({ area, role })` em `apps/web/features/auth/access.ts` que devolve `allow` ou o destino do redirect. É a única regra de acesso do app.

| Área | Sem sessão | `client` | `team` / `admin` |
| --- | --- | --- | --- |
| console | `/login?next=<rota>` | `/portal` | entra |
| portal | `/login?next=<rota>` | entra | entra |
| vitrine, login | entra | entra | entra |

- `getCurrentUser()` em `apps/web/features/auth/queries.ts`: `getClaims()` + leitura do próprio `profiles` (id, nome, papel). Sem `getSession()`.
- `(console)/layout.tsx` e `(portal)/layout.tsx` chamam `getCurrentUser()` e `resolveAccess`, e fazem `redirect` quando preciso. Os layouts ficam dinâmicos.
- Login com sessão ativa manda para `/` (equipe) ou `/portal` (cliente).
- Origem: backlog, "provar o fail-fast do env numa rota dinâmica". Os layouts dinâmicos são essa rota.

## Fora de escopo
- Permissão por projeto (`project_members`, S2).
- Menu e layout visual (card 06).

## Cenários (BDD)
```gherkin
Funcionalidade: Cada um na sua área

  Esquema do Cenário: Regra de acesso
    Dado um visitante com papel "<papel>"
    Quando ele abre a área "<área>"
    Então o resultado é "<resultado>"

    Exemplos:
      | papel   | área    | resultado              |
      | nenhum  | console | /login?next=<rota>     |
      | nenhum  | portal  | /login?next=<rota>     |
      | nenhum  | vitrine | allow                  |
      | client  | console | /portal                |
      | client  | portal  | allow                  |
      | team    | console | allow                  |
      | admin   | portal  | allow                  |

  Cenário: Cliente digita a URL do console
    Dado "cliente@nos.local" com sessão
    Quando ele abre "/seixu"
    Então ele vai para "/portal"

  Cenário: Volta para onde estava depois do login
    Dado um visitante sem sessão que abriu "/seixu"
    Quando ele entra pelo magic link
    Então ele chega em "/seixu"

  Cenário: Env inválido derruba rota dinâmica em produção
    Dado um build de produção sem "NEXT_PUBLIC_SUPABASE_URL"
    Quando alguém abre "/"
    Então o servidor falha citando a variável
```

## Critérios de aceite
- [ ] Os 3 usuários do seed testados à mão no local
- [ ] `resolveAccess` com 100% de ramos cobertos
- [ ] Item do backlog sobre fail-fast em rota dinâmica removido

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Regra de acesso (tabela) | unit, `it.each` com os exemplos | `apps/web/features/auth/access.test.ts` |
| `getCurrentUser` sem sessão e com sessão | unit com cliente mockado | `apps/web/features/auth/queries.test.ts` |
| Cliente no console, volta após login | manual, evidência no PR (E2E na S6) | — |
| Fail-fast em produção | `next build && next start` sem a variável, evidência no PR | — |

## Limites
- Até 12 arquivos. Nenhuma dependência nova.
