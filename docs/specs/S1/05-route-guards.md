# NOS-16 · Acesso por área: console, portal e vitrine

**Sprint:** S1 · **Estimativa:** 2 h · **Branch:** `feat/s1-route-guards`
**Mudança de 12/11:** o console sai de `/` e vai para `/console`. A raiz fica para a landing da Nós (S6); até lá, `/` só redireciona.

## Objetivo
Cada grupo de rota decide quem entra: o console (`/console`) é da equipe, o portal (`/portal`) é de quem tem sessão, a raiz, a vitrine e o login são públicos. Um cliente não abre o console nem digitando a URL.

## Contexto (o Claude lê só isto)
- `apps/web/app/(console)/`, `apps/web/app/(portal)/`, `apps/web/app/(public)/`, `apps/web/app/(auth)/`, `apps/web/app/auth/confirm/route.ts`
- `apps/web/features/auth/safe-next.ts` (do card 04)
- `apps/web/lib/supabase/server.ts`, `apps/web/features/auth/`, `docs/adr/0010-*.md`

## Referências (context7)
- next.js 16 (layouts, `redirect`, rotas dinâmicas), supabase ssr (`getClaims` no servidor)

## Requisitos
- Função pura `resolveAccess({ area, role })` em `apps/web/features/auth/access.ts` que devolve `allow` ou o destino do redirect. É a única regra de acesso do app.

| Área | Sem sessão | `client` | `team` / `admin` |
| --- | --- | --- | --- |
| console | `/login?next=<rota>` | `/portal` | entra |
| portal | `/login?next=<rota>` | entra | entra |
| raiz, vitrine, login | entra | entra | entra |

- `getCurrentUser()` em `apps/web/features/auth/queries.ts`: `getClaims()` + leitura do próprio `profiles` (id, nome, papel). Sem `getSession()`.
- `(console)/layout.tsx` e `(portal)/layout.tsx` chamam `getCurrentUser()` e `resolveAccess`, e fazem `redirect` quando preciso. Os layouts ficam dinâmicos.
- Login com sessão ativa manda para `/console` (equipe) ou `/portal` (cliente).
- **Console em `/console`:** mover `app/(console)/page.tsx` para `app/(console)/console/page.tsx` e `app/(console)/seixu/` para `app/(console)/console/seixu/`. O layout do grupo continua em `app/(console)/layout.tsx`.
- `homeFor(role)` em `access.ts`: `/console` para `team` e `admin`, `/portal` para `client`. Sem `next`, o redirect depois do login usa `homeFor` em vez de `/` (ajuste no `safeNext` e no `/auth/confirm` do card 04).
- **Raiz provisória** `app/(public)/page.tsx`: sem sessão → `/login`; com sessão → `homeFor(role)`. A landing (S6) substitui esta página sem mudar o resto.
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
      | nenhum  | raiz    | allow                  |
      | client  | console | /portal                |
      | client  | portal  | allow                  |
      | team    | console | allow                  |
      | admin   | portal  | allow                  |

  Cenário: Cliente digita a URL do console
    Dado "cliente@nos.local" com sessão
    Quando ele abre "/console/seixu"
    Então ele vai para "/portal"

  Cenário: Volta para onde estava depois do login
    Dado um visitante sem sessão que abriu "/console/seixu"
    Quando ele entra pelo magic link
    Então ele chega em "/console/seixu"

  Cenário: Login sem destino vai para a casa do papel
    Dado "equipe@nos.local" entrando pelo magic link sem "next"
    Então ele chega em "/console"
    E "cliente@nos.local", no mesmo caso, chega em "/portal"

  Cenário: Raiz provisória
    Quando um visitante sem sessão abre "/"
    Então ele vai para "/login"
    Quando "equipe@nos.local" com sessão abre "/"
    Então ele vai para "/console"

  Cenário: Env inválido derruba rota dinâmica em produção
    Dado um build de produção sem "NEXT_PUBLIC_SUPABASE_URL"
    Quando alguém abre "/console"
    Então o servidor falha citando a variável
```

## Critérios de aceite
- [ ] Os 3 usuários do seed testados à mão no local
- [ ] `resolveAccess` com 100% de ramos cobertos
- [ ] Item do backlog sobre fail-fast em rota dinâmica removido

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Regra de acesso (tabela) e `homeFor` | unit, `it.each` com os exemplos | `apps/web/features/auth/access.test.ts` |
| Destino sem `next` | unit | `apps/web/features/auth/safe-next.test.ts` |
| `getCurrentUser` sem sessão e com sessão | unit com cliente mockado | `apps/web/features/auth/queries.test.ts` |
| Cliente no console, volta após login | manual, evidência no PR (E2E na S6) | — |
| Fail-fast em produção | `next build && next start` sem a variável, evidência no PR | — |

## Limites
- Até 16 arquivos (os moves contam). Nenhuma dependência nova.
