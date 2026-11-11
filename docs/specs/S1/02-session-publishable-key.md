# NOS-13 · Sessão: publishable key, proxy e URLs de redirect

**Sprint:** S1 · **Estimativa:** 1,5 h · **Branch:** `feat/s1-session-proxy`

## Objetivo
O app usa a publishable key do Supabase, renova a sessão a cada requisição pelo `proxy.ts` do Next 16, e as URLs de redirect do Auth local batem com o `bun run dev`.

## Contexto (o Claude lê só isto)
- `apps/web/lib/env.ts`, `apps/web/lib/env.test.ts`, `apps/web/lib/supabase/`, `apps/web/instrumentation.ts`
- `supabase/config.toml` (só `[auth]`), `.env.example`
- `docs/adr/0004-vercel-environments.md`, `docs/adr/0009-local-supabase-dev.md`, `docs/specs/backlog.md`

## Referências (context7)
- supabase ssr com next.js (proxy, `updateSession`, `getClaims`), next.js 16 (`proxy.ts`, `matcher`)

## Requisitos
- Origem: backlog, 3 itens do NOS-2 e do PR #16 que estavam marcados como S2 (auth) e entram aqui.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` vira `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (formato `sb_publishable_…`) em `env.ts`, nos clientes, no teste e no `.env.example`. A validação do Zod aceita só esse prefixo.
- `apps/web/proxy.ts` exporta `proxy` e chama `updateSession` de `apps/web/lib/supabase/proxy.ts`. O `updateSession` só renova a sessão: chama `getClaims()`, devolve a resposta com os cookies atualizados e não redireciona ninguém (autorização fica nos layouts, card 05).
- `matcher` do Supabase: tudo menos `_next/static`, `_next/image`, `favicon.ico` e imagens.
- Sai o comentário "session refresh belongs to the auth middleware (S2)" de `server.ts`; fica um comentário curto dizendo que o `proxy.ts` renova a sessão.
- `supabase/config.toml`: `site_url = "http://localhost:3000"` e `additional_redirect_urls` com `http://localhost:3000/**` e `http://127.0.0.1:3000/**`.
- ADRs 0004 e 0009 citam a publishable key no lugar da anon key.
- Fora do repo (você): na Vercel, cria `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Production e Preview) **antes** do merge e apaga a `ANON_KEY` depois; no painel do `nos-prod`, em Auth → URL Configuration, coloca a URL de produção como Site URL e `https://*-<seu-time>.vercel.app/**` nos redirects.

## Fora de escopo
- Tela de login e qualquer redirect por falta de sessão (cards 04 e 05).

## Cenários (BDD)
```gherkin
Funcionalidade: Sessão sempre válida

  Cenário: Chave antiga não sobe o app
    Dado que só "NEXT_PUBLIC_SUPABASE_ANON_KEY" está definida
    Quando o app inicia
    Então ele falha citando "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

  Cenário: Chave em formato errado
    Dado "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" com um JWT legado
    Quando o env é validado
    Então a validação falha citando a variável

  Cenário: Proxy renova os cookies
    Dado uma requisição com cookies de sessão
    Quando o proxy roda e o Supabase devolve cookies novos
    Então a resposta carrega os cookies novos

  Cenário: Proxy não redireciona
    Dado uma requisição sem sessão para "/"
    Quando o proxy roda
    Então a resposta segue sem redirect

  Cenário: Arquivo estático não passa pelo proxy
    Quando a requisição é para "/_next/static/x.js" ou "/logo.svg"
    Então o matcher não casa
```

## Critérios de aceite
- [ ] `rg "ANON_KEY"` vazio fora do histórico dos ADRs
- [ ] `proxy.ts` usa `getClaims()`, nunca `getSession()`
- [ ] Preview da PR sobe com a variável nova

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Chave antiga, formato errado | unit (Vitest) | `apps/web/lib/env.test.ts` |
| Renova cookies, não redireciona | unit com `createServerClient` mockado | `apps/web/lib/supabase/proxy.test.ts` |
| Matcher | unit (casa a regex do `config.matcher`) | `apps/web/proxy.test.ts` |

## Limites
- Até 12 arquivos. Nenhuma dependência nova.
