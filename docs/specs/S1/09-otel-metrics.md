# NOS-20 · Métricas com OpenTelemetry no Grafana Cloud

**Sprint:** S1 · **Estimativa:** 2 h · **Branch:** `feat/s1-otel-metrics`
**Segundo card a cortar** se a sprint apertar (o primeiro é o Google, já movido para a S2). Se cortar, vai para o backlog com destino S2.

## Objetivo
O app publica métricas próprias pelo OpenTelemetry e dá para acompanhar, num dashboard do Grafana Cloud, logins, acessos negados e a duração das ações do servidor em produção, sem custo.

## Contexto (o Claude lê só isto)
- `apps/web/instrumentation.ts`, `apps/web/lib/env.ts`, `apps/web/features/auth/actions.ts`, `apps/web/features/auth/access.ts`, `apps/web/app/auth/confirm/route.ts`, `.env.example`
- `docs/adr/0011-*.md`

## Referências (context7)
- opentelemetry js (`@opentelemetry/api` metrics, `MeterProvider`, `PeriodicExportingMetricReader`, `OTLPMetricExporter` http, `forceFlush`), next.js 16 (`after` de `next/server`), grafana cloud (OTLP endpoint e autenticação)

## Requisitos
- `apps/web/lib/observability/metrics.ts`: um `MeterProvider` só para o runtime Node, exportando OTLP/HTTP para o Grafana Cloud. Liga só quando `OTEL_EXPORTER_OTLP_ENDPOINT` existe; sem a variável, os instrumentos viram no-op e nada é enviado.
- O provider é registrado no `register()` de `instrumentation.ts` sem trocar o tracer do Sentry (spans continuam com o Sentry, ADR 0011). Confirme no context7 que registrar só o `MeterProvider` global não interfere no setup de OpenTelemetry do Sentry.
- Serverless: o processo pode congelar antes do export periódico. Depois de cada ação e route handler instrumentados, `after(() => meterProvider.forceFlush())`.
- Instrumentos (nomes em inglês, unidades no padrão OTel):

| Nome | Tipo | Atributos | Onde |
| --- | --- | --- | --- |
| `nos.auth.magic_link.requested` | counter | `result` (`sent`, `invalid_email`, `rate_limited`) | `requestMagicLink` |
| `nos.auth.login` | counter | `method` (`magic_link`, `google`), `result` (`success`, `failure`) | `/auth/confirm` (e `/auth/callback` quando existir) |
| `nos.access.denied` | counter | `area` (`console`, `portal`), `reason` (`no_session`, `role`) | layouts, a partir do `resolveAccess` |
| `nos.server_action.duration` | histogram (ms) | `action` | wrapper fino para as ações de auth |

- Nunca usar e-mail, id de usuário ou URL completa como atributo: só valores de conjunto fechado, para não estourar as 10 mil séries do plano gratuito e não carregar dado pessoal.
- `OTEL_SERVICE_NAME=nos-plataforma`; `deployment.environment` vem do `VERCEL_ENV`.
- Env: `OTEL_EXPORTER_OTLP_ENDPOINT` e `OTEL_EXPORTER_OTLP_HEADERS` (secretos, só servidor) no `.env.example` com valores fictícios; obrigatórios quando `VERCEL_ENV === "production"`.
- Fora do repo (você): o dashboard e um alerta no Grafana, descritos no card manual de observabilidade.

## Fora de escopo
- Métricas de infraestrutura (CPU, memória): a Vercel não expõe sem plano pago.
- Traces e logs no Grafana: ficam no Sentry.

## Cenários (BDD)
```gherkin
Funcionalidade: Métricas do produto em produção

  Cenário: Login conta uma vez
    Dado o preview com o Grafana configurado
    Quando a Ju entra pelo magic link
    Então "nos.auth.login" com method "magic_link" e result "success" aumenta em 1 no Grafana

  Cenário: Acesso negado por papel
    Quando "cliente@nos.local" abre "/seixu"
    Então "nos.access.denied" com area "console" e reason "role" aumenta em 1

  Cenário: Pedido de link com e-mail inválido
    Quando alguém envia "nao-e-email" no login
    Então "nos.auth.magic_link.requested" com result "invalid_email" aumenta em 1

  Cenário: Métrica chega mesmo com função curta
    Dado uma ação que termina em menos de 100 ms
    Quando a requisição acaba
    Então o ponto da métrica chega ao Grafana em até 2 minutos

  Cenário: Sem dado pessoal nos atributos
    Então nenhum atributo das métricas contém e-mail, id de usuário ou query string

  Cenário: Desenvolvimento sem Grafana
    Dado o .env.local sem OTEL_EXPORTER_OTLP_ENDPOINT
    Quando eu rodo "bun run dev"
    Então o app sobe e nada é exportado
```

## Critérios de aceite
- [ ] Os 4 instrumentos aparecem no Grafana a partir de um preview
- [ ] Dashboard "Nós · Produto" criado (card manual) com um painel por instrumento
- [ ] Cardinalidade total abaixo de 100 séries

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Contadores certos por resultado | unit com `MeterProvider` em memória (`InMemoryMetricExporter`) | `apps/web/lib/observability/metrics.test.ts` |
| Atributos só de conjunto fechado | unit (tipos + teste dos valores aceitos) | `apps/web/lib/observability/metrics.test.ts` |
| No-op sem endpoint | unit | `apps/web/lib/observability/metrics.test.ts` |
| Env obrigatório em produção | unit | `apps/web/lib/env.test.ts` |
| Chegada no Grafana, função curta | manual no preview, evidência no PR | — |

## Limites
- Até 12 arquivos. Dependências: `@opentelemetry/api`, `@opentelemetry/sdk-metrics`, `@opentelemetry/exporter-metrics-otlp-http`, `@opentelemetry/resources`, `@opentelemetry/semantic-conventions` (versões exatas e compatíveis entre si).
