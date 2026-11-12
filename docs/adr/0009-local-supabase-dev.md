# 0009 · Supabase local em Docker como dev e Preview no banco de produção

**Status:** Aceita · **Data:** 2026-11-11

## Contexto
O plano gratuito do Supabase não comporta `nos-dev` e `nos-prod` ao mesmo tempo. O banco local (`supabase start`) já roda as mesmas migrations e o pgTAP, e o Preview da Vercel apontava para o `nos-dev`.

## Decisão
- O ambiente de dev é só o Supabase local em Docker. O único projeto hospedado é o `nos-prod`.
- Preview na Vercel usa `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` do `nos-prod` (a anon key até o NOS-13), e nenhuma outra chave do Supabase. Isso altera o ADR 0004, que proibia valor de produção em Preview.
- Development na Vercel fica sem variáveis do Supabase: o dev roda com o `.env.local` apontando para o Supabase local (`supabase start`), e `vercel env pull`/`vercel dev` nunca trazem chave de produção.
- O fail-fast do env no boot continua igual em todos os ambientes.
- O MCP do Supabase aponta para o `nos-prod` em `read_only` (`SUPABASE_PROD_PROJECT_REF`).

## Alternativas descartadas
- Manter o `nos-dev` hospedado: estoura o limite de projetos do plano gratuito.
- Supabase Branching (banco efêmero por PR): exige plano pago.
- Preview sem banco: telas com dados quebrariam no preview e só poderiam ser revisadas localmente.

## Consequências
- Telas com dados funcionam no preview, com dados reais.
- Código ainda em revisão lê e escreve em produção com a publishable key: a RLS e o GRANT explícito (ADR 0007) são a única barreira; o Vercel Authentication protege as páginas do preview, mas não a Data API: a publishable key vai no bundle do navegador e qualquer um que a tenha fala direto com o `nos-prod`, como já acontece com a de produção. Um erro de policy numa PR aparece em dados de produção, não num banco descartável.
- Teste que escreve dados (seed, E2E) roda só no banco local, nunca contra um preview.
- Quando houver plano pago, o Branching volta à mesa para isolar os previews.

## Fonte
- https://vercel.com/docs/environment-variables/manage-across-environments
- https://supabase.com/docs/guides/local-development
