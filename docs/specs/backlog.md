# Backlog fora da sprint atual

Itens levantados nas sprints que pertencem a sprints futuras. Cada um tem origem e destino; nada fica solto. Ao planejar a sprint de destino, o item vira requisito de um card ou é descartado aqui com o motivo.

| Item | Origem | Destino | Onde entra |
| --- | --- | --- | --- |
| Alinhar `site_url` e `additional_redirect_urls` do `supabase/config.toml` com `http://localhost:3000` | Review do PR #16 | S1 | NOS-13 (`docs/specs/S1/02-session-publishable-key.md`) |
| Trocar `NEXT_PUBLIC_SUPABASE_ANON_KEY` pela publishable key (`sb_publishable_…`) | NOS-2 | S1 | NOS-13 |
| Refresh de sessão do `@supabase/ssr` (no Next 16 é `proxy.ts`, não `middleware.ts`) | NOS-2 | S1 | NOS-13 |
| Provar o fail-fast do env em produção numa rota dinâmica (hoje só há páginas estáticas) | NOS-2 | S1 | NOS-16 (`docs/specs/S1/05-route-guards.md`) |
| pgTAP no CI (`bunx supabase test db`) | NOS-4 | S1 | NOS-12 (`docs/specs/S1/01-pgtap-ci.md`) |
| Rever Vercel Authentication para abrir produção ao público, com domínio próprio | NOS-1 parte 2 (ADR 0004) | S6 | Card de domínio e plano Pro |
| Playwright no CI | NOS-4 | S6 | Card de E2E |
| Voltar a um TypeScript só quando o typescript-eslint suportar o tsgo | ADR 0005 | S2 (planejamento) | Checado em 11/11/2026: o typescript-eslint ainda exige `typescript <6.1`. Alternativa a avaliar: oxlint com `oxlint-tsgolint`, que roda sobre o TS 7.0.2 e cobre 59 das 61 regras type-aware. Checar de novo no planejamento da S2 |
| Medir contraste AA do tema claro (texto branco sobre `#2f5fd6`, badges) quando os valores finais forem definidos | Review do NOS-6 | S? (PDF) | Card do PDF; estender `packages/seixu/src/tokens.test.ts` ao tema claro |
| SMTP próprio no Supabase (Resend, Brevo ou similar): o SMTP padrão só entrega para o time do projeto e tem limite de 2 e-mails por hora | Planejamento da S1 | S2 | Antes do card de convite de cliente; ligar no `nos-prod` e citar no ADR 0010 |
| Equipe lendo perfis de clientes (função `is_staff()` ou equivalente para RLS) | NOS-14 | S2 | Card de `project_members` |
| Login com Google para a equipe | NOS-18 | S2 | Spec `docs/specs/S1/07-google-login.md`; movido da S1 para abrir espaço para o NOS-19 e o NOS-20 |
| Sentry e Grafana Cloud como operadores na política de privacidade | ADR 0011 | S6 | Card de termos de uso e LGPD |
| Portal lista projetos em execução e executados; `project_links.kind` (production, domain, infra, repository, documentation, design, staging) e `internal` para painéis sensíveis | Pedido da Ju (12/11) | S3 | Cards de links e de visão geral do portal |
| Tabela `sprints` por projeto, `backlog_items.sprint_id` e visão das sprints no portal | Pedido da Ju (12/11) | S4 | Card de backlog |
| Descontos no motor de preço (cupom e crédito de fidelidade) com teto e piso de margem | Pedido da Ju (12/11) | S8 | Card do `packages/pricing` |
| Onda 2B · contrato com aceite eletrônico, parcelas e InfinitePay (webhook sem assinatura: confirmar no `payment_check`), financeiro no portal, fidelidade, solicitações | Pedido da Ju (12/11) | S12–S16 | Ver o documento de arquitetura, seção "Portal financeiro, contrato e fidelidade" |
