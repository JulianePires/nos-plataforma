# Backlog fora da sprint atual

Itens levantados durante a S0 que pertencem a sprints futuras. Cada um tem origem e destino; nada fica solto. Ao planejar a sprint de destino, o item vira requisito de um card ou é descartado aqui com o motivo.

| Item | Origem | Destino | Onde entra |
| --- | --- | --- | --- |
| Alinhar `site_url` e `additional_redirect_urls` do `supabase/config.toml` com `http://localhost:3000` | Review do PR #16 | S2 (auth) | Card de login |
| Trocar `NEXT_PUBLIC_SUPABASE_ANON_KEY` pela publishable key (`sb_publishable_…`) | NOS-2 | S2 (auth) | Card de login; atualizar `lib/env.ts`, Vercel e `.env.example` |
| Middleware de refresh de sessão do `@supabase/ssr` | NOS-2 | S2 (auth) | Card de login |
| Provar o fail-fast do env em produção numa rota dinâmica (hoje só há páginas estáticas) | NOS-2 | S1 | Primeiro card com rota dinâmica |
| pgTAP no CI (`bunx supabase test db`) | NOS-4 | S1 | Primeiro card com tabela |
| Rever Vercel Authentication para abrir produção ao público, com domínio próprio | NOS-1 parte 2 (ADR 0004) | S6 | Card de domínio e plano Pro |
| Playwright no CI | NOS-4 | S6 | Card de E2E |
| Voltar a um TypeScript só quando o typescript-eslint suportar o tsgo | ADR 0005 | S1 (planejamento) | Checar o suporte no planejamento de cada sprint; se existir, vira card e o ADR 0005 é substituído |
| Ambiente de dev passa a ser o Supabase local em Docker, sem `nos-dev` hospedado (limite do plano gratuito). Inclui ADR novo, ADR 0004 atualizado (Preview da Vercel sem variáveis do Supabase), specs 04 e 05, `docs/prompts/S0-sessoes.md` e o MCP do Supabase apontando para o `nos-prod` em `read_only` | NOS-9 | S0 | Card `chore` novo, antes da S1 |
| Medir contraste AA do tema claro (texto branco sobre `#2f5fd6`, badges) quando os valores finais forem definidos | Review do NOS-6 | S? (PDF) | Card do PDF; estender `packages/seixu/src/tokens.test.ts` ao tema claro |
