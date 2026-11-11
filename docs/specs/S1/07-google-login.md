# NOS-18 · Login com Google para a equipe

**Sprint:** S1 · **Estimativa:** 1 h · **Branch:** `feat/s1-google-login`
**Primeiro card a cortar** se a sprint apertar (plano de implementação). Se cortar, vai para o backlog com destino S2.

## Objetivo
A equipe entra com a conta Google. Quem entra pelo Google sem ter sido promovido continua `client` e cai no portal.

## Contexto (o Claude lê só isto)
- `apps/web/features/auth/`, `apps/web/app/(auth)/login/page.tsx`, `supabase/config.toml` (só `[auth.external.google]`), `.env.example`, `docs/adr/0010-*.md`

## Referências (context7)
- supabase auth (`signInWithOAuth`, `exchangeCodeForSession`, provider google local), next.js 16 (route handlers)

## Requisitos
- Botão "Entrar com Google (equipe Nós)" na tela de login, abaixo do formulário de magic link.
- Server Action `signInWithGoogle` chama `signInWithOAuth` com `redirectTo` para `/auth/callback` e repassa o `next` seguro (mesma `safeNext` do card 04).
- `app/auth/callback/route.ts`: `exchangeCodeForSession(code)` e redirect para `next`; sem `code` ou com erro, `/login?error=oauth`.
- `config.toml`: `[auth.external.google] enabled = true` com `client_id` e `secret` via `env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)` e `env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)`; os dois nomes no `.env.example`.
- Fora do repo (você): cliente OAuth no Google Cloud com os redirects `http://127.0.0.1:54321/auth/v1/callback` e `https://<ref-do-nos-prod>.supabase.co/auth/v1/callback`; provider Google ligado no painel do `nos-prod`.

## Fora de escopo
- Restringir o Google a um domínio de e-mail. O papel padrão `client` já impede acesso ao console (ADR 0010).

## Cenários (BDD)
```gherkin
Funcionalidade: Equipe entra com Google

  Cenário: Primeiro acesso pelo Google
    Dado uma conta Google sem usuário no Auth
    Quando ela entra pelo botão do Google
    Então um profile "client" é criado com o nome da conta
    E ela chega em "/portal"

  Cenário: Equipe promovida
    Dado um usuário Google com papel "team"
    Quando ele entra pelo Google
    Então ele chega em "/"

  Cenário: Callback sem código
    Quando "/auth/callback" é aberto sem "code"
    Então o usuário vai para "/login?error=oauth"

  Cenário: Callback com next externo
    Quando o callback chega com "next=https://site-externo.com"
    Então o redirect vai para "/"
```

## Critérios de aceite
- [ ] Login Google testado no local e no preview com a sua conta
- [ ] Nenhum segredo do Google no repo (`rg "GOCSPX"` vazio)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Callback sem código, next externo | unit do route handler com cliente mockado | `apps/web/app/auth/callback/route.test.ts` |
| Action chama `signInWithOAuth` com `redirectTo` | unit com cliente mockado | `apps/web/features/auth/actions.test.ts` |
| Primeiro acesso, equipe promovida | manual, evidência no PR | — |

## Limites
- Até 8 arquivos. Nenhuma dependência nova.
