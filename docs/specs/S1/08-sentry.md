# NOS-19 · Sentry: erros, traces e logs

**Sprint:** S1 · **Estimativa:** 2 h · **Branch:** `feat/s1-sentry`

## Objetivo
Todo erro do app (navegador, servidor e proxy) chega ao Sentry com stack trace legível, release e ambiente, e dá para ver traces e logs de uma requisição em produção, sem custo.

## Contexto (o Claude lê só isto)
- `apps/web/instrumentation.ts`, `apps/web/next.config.js`, `apps/web/proxy.ts`, `apps/web/lib/env.ts`, `apps/web/lib/env.test.ts`, `.env.example`
- `docs/adr/0004-vercel-environments.md`, `docs/adr/0009-local-supabase-dev.md`

## Referências (context7)
- sentry nextjs (v10: `instrumentation.ts`, `instrumentation-client.ts`, `onRequestError`, `withSentryConfig`, `tunnelRoute`, `enableLogs`, Turbopack e source maps), next.js 16 (instrumentation)

## Requisitos
- ADR 0011 "Observabilidade sem custo" (ver ao final desta spec).
- `@sentry/nextjs` em `apps/web`, com config por runtime: cliente (`instrumentation-client.ts`), servidor e edge (carregados pelo `register()` de `instrumentation.ts`). O `register()` continua validando o env antes de tudo.
- `export const onRequestError = Sentry.captureRequestError` em `instrumentation.ts`.
- `next.config.js` envolvido por `withSentryConfig`: upload de source maps só no build da Vercel (com `SENTRY_AUTH_TOKEN`), source maps apagados do bundle público depois do upload, `tunnelRoute: "/monitoring"` para o envio não ser bloqueado por adblock.
- O `matcher` do `proxy.ts` exclui `/monitoring`.
- `environment` = `VERCEL_ENV` (`production`, `preview`) ou `development`; `release` = SHA do commit da Vercel.
- Amostragem: `tracesSampleRate` 0.1 em produção e 1.0 em preview; replay só quando há erro (`replaysOnErrorSampleRate: 1.0`, `replaysSessionSampleRate: 0`), com todo texto e input mascarados.
- Logs: `enableLogs: true`; `console.error` e `console.warn` do servidor viram logs no Sentry.
- Privacidade (LGPD): `sendDefaultPii: false`; o usuário entra no escopo só pelo `id` do Supabase, nunca e-mail ou nome; `beforeSend` remove `token_hash` e `code` de URLs (vêm do magic link e do OAuth).
- Env: `NEXT_PUBLIC_SENTRY_DSN` obrigatório quando `VERCEL_ENV === "production"`, opcional no resto. Sem DSN, o Sentry não inicializa e o app sobe normal. `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` e `SENTRY_PROJECT` só no build da Vercel, nunca no código.
- Nenhuma rota de teste permanente. Para provar o envio, use uma branch descartável com um botão que lança erro, e apague depois.
- Fora do repo (você): card "Contas e chaves de observabilidade" no Notion.

## Fora de escopo
- Métricas de negócio e dashboards (NOS-20).
- Alertas além dos padrão do Sentry (configurados no card manual).

## Cenários (BDD)
```gherkin
Funcionalidade: Erros visíveis em produção

  Cenário: Erro no servidor
    Dado um Server Component que lança uma exceção no preview
    Quando alguém abre a página
    Então o erro aparece no Sentry com ambiente "preview", a release do commit e o stack trace apontando para o arquivo .tsx original

  Cenário: Erro no navegador
    Dado um botão que lança erro no cliente
    Quando o usuário clica
    Então o erro aparece no Sentry com um replay mascarado da sessão

  Cenário: Envio passa pelo túnel
    Dado um bloqueador de anúncios ativo
    Quando um erro de cliente acontece
    Então o evento chega ao Sentry pela rota "/monitoring"
    E o proxy de sessão não roda para "/monitoring"

  Cenário: Dados pessoais não vazam
    Dado um usuário logado que abre um link com "token_hash" na URL
    Quando um erro acontece nessa requisição
    Então o evento traz só o id do usuário
    E a URL do evento não traz "token_hash"

  Cenário: Desenvolvimento sem Sentry
    Dado o .env.local sem NEXT_PUBLIC_SENTRY_DSN
    Quando eu rodo "bun run dev"
    Então o app sobe e nada é enviado

  Cenário: Produção sem DSN não sobe
    Dado VERCEL_ENV = "production" sem NEXT_PUBLIC_SENTRY_DSN
    Quando o env é validado
    Então a validação falha citando a variável

  Cenário: Source map não fica público
    Dado o build de produção
    Então nenhum arquivo ".map" é servido em "/_next/static"
```

## Critérios de aceite
- [ ] Erro de servidor e de cliente aparecem no Sentry a partir de um preview, com stack trace original
- [ ] Um trace de requisição e um log do servidor aparecem ligados ao mesmo evento
- [ ] Branch descartável apagada; nenhuma rota de teste na `main`
- [ ] ADR 0011 com status Aceita

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| DSN obrigatório só em produção | unit | `apps/web/lib/env.test.ts` |
| Limpeza de `token_hash` e `code`; usuário só com id | unit (função pura do `beforeSend`) | `apps/web/lib/observability/scrub.test.ts` |
| Matcher sem `/monitoring` | unit | `apps/web/proxy.test.ts` |
| Erros, túnel, replay, source maps | manual no preview, evidência no PR | — |

## Limites
- Até 14 arquivos. Dependência: `@sentry/nextjs` (versão exata, compatível com Next 16; confirme no context7).

---

## Conteúdo do ADR 0011 (para o `/adr`)
- **Decisão:** a instrumentação do código usa a API do OpenTelemetry (`@opentelemetry/api`) para spans e métricas próprias, o que mantém o código livre de fornecedor. O Sentry (plano Developer, gratuito) recebe erros, traces e logs: o SDK do Sentry para Next.js já roda sobre OpenTelemetry e captura os spans criados pela API. O Grafana Cloud (plano Free) recebe as métricas via OTLP e guarda dashboards e alertas.
- **Sem custo:** nenhuma das duas contas tem cartão cadastrado; quando a cota acaba, os dados novos são descartados até o próximo mês, sem cobrança. Amostragem de traces em 10% em produção.
- **Cotas de referência (nov/2026):** Sentry Developer com 1 usuário, 5 mil erros, 5 milhões de spans, 5 GB de logs, 50 replays, 1 monitor de uptime, 1 cron e 30 dias de histórico. Grafana Cloud Free com 10 mil séries de métricas, 50 GB de logs, 50 GB de traces, 14 dias de retenção e 3 usuários.
- **Descartados:** Vercel Drains (só no plano Pro), Datadog e New Relic (cota gratuita curta ou cobrança por host), Grafana para tudo (perde o agrupamento de erros, os source maps e o replay do Sentry).
- **Privacidade:** sem PII; Sentry e Grafana entram como operadores na política de privacidade.
