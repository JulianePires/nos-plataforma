# NOS-15 · Login por magic link e logout

**Sprint:** S1 · **Estimativa:** 2 h · **Branch:** `feat/s1-magic-link`

## Objetivo
Um usuário que já existe recebe um link por e-mail, entra com um clique e sai pelo botão "Sair".

## Contexto (o Claude lê só isto)
- `apps/web/lib/supabase/`, `apps/web/lib/env.ts`, `supabase/config.toml` (só `[auth.email]` e `[inbucket]`)
- `packages/seixu/README.md` (Button e Input), `docs/adr/0010-*.md`

## Referências (context7)
- supabase auth (`signInWithOtp`, `verifyOtp` com `token_hash`, template de e-mail), next.js 16 (server actions, route handlers, `redirect`)

## Requisitos
- `apps/web/features/auth/`: `schema.ts` (Zod: e-mail), `actions.ts` (`requestMagicLink`, `signOut`), `components/login-form.tsx`.
- `requestMagicLink` chama `signInWithOtp` com `shouldCreateUser: false` (só entra quem já existe; clientes chegam por convite na S2) e `emailRedirectTo` para `/auth/confirm`.
- Resposta igual para e-mail cadastrado e não cadastrado ("Se o e-mail estiver cadastrado, o link chega em instantes"), para não revelar quem é usuário.
- `app/(auth)/login/page.tsx` com o formulário (Input com label, Button primário). Mensagens de erro de `?error=` (link expirado, limite de envio).
- `app/auth/confirm/route.ts`: `verifyOtp({ token_hash, type })` e redirect para `next`. `next` só aceita caminho relativo que começa com `/` e não com `//` (sem open redirect); padrão `/`.
- Template do magic link em `supabase/templates/magic-link.html`, com `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`, ligado no `config.toml`. Texto em português, sem fonte com serifa.
- Fora do repo (você): o mesmo template no painel do `nos-prod` (Auth → Email Templates → Magic Link).

## Fora de escopo
- SMTP próprio: o SMTP padrão do Supabase só entrega para e-mails do time do projeto e tem limite de 2 por hora. Serve para você testar no preview; para clientes, vai para o backlog (S2, antes do primeiro convite).
- Redirect por falta de sessão (card 05).

## Cenários (BDD)
```gherkin
Funcionalidade: Entrar sem senha

  Cenário: Pedir o link
    Dado o usuário "cliente@nos.local" no seed
    Quando ele pede o link em "/login"
    Então a tela mostra a mensagem neutra
    E o e-mail aparece no Mailpit local com link para "/auth/confirm"

  Cenário: E-mail não cadastrado
    Quando alguém pede o link para "ninguem@exemplo.com"
    Então a tela mostra a mesma mensagem neutra
    E nenhum usuário é criado

  Cenário: E-mail inválido
    Quando alguém envia "nao-e-email"
    Então o campo mostra o erro de validação e nada é enviado

  Cenário: Link válido abre a sessão
    Quando o usuário abre o link do e-mail
    Então ele chega em "/" com sessão ativa

  Cenário: Open redirect bloqueado
    Quando o link chega com "next=//site-externo.com"
    Então o redirect vai para "/"

  Cenário: Link expirado
    Quando o "token_hash" é inválido
    Então o usuário volta para "/login?error=link"

  Cenário: Sair
    Dado um usuário com sessão
    Quando ele aciona "Sair"
    Então a sessão acaba e ele vai para "/login"
```

## Critérios de aceite
- [ ] Fluxo completo testado à mão no local (Mailpit em `http://127.0.0.1:54324`) e no preview com o seu e-mail
- [ ] Nenhuma mensagem diferencia e-mail cadastrado de não cadastrado
- [ ] Formulário navegável por teclado, com label e erro anunciado (`aria-describedby`)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Validação do e-mail | unit | `apps/web/features/auth/schema.test.ts` |
| Mensagem neutra, `shouldCreateUser: false` | unit com cliente mockado | `apps/web/features/auth/actions.test.ts` |
| `next` seguro | unit (função pura `safeNext`) | `apps/web/features/auth/safe-next.test.ts` |
| Link válido, expirado | unit do route handler com cliente mockado | `apps/web/app/auth/confirm/route.test.ts` |
| Fluxo ponta a ponta | manual, evidência no PR (E2E na S6) | — |

## Limites
- Até 15 arquivos. Nenhuma dependência nova.
