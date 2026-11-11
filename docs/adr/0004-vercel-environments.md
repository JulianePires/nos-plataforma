# 0004 · Vercel: ambientes, variáveis e região

**Status:** Aceita, atualizada pelo ADR 0009 (2026-11-11) · **Data:** 2026-11-10

## Contexto
A integração do Supabase com a Vercel injetava as 16 chaves do `nos-dev` (inclusive service role, JWT secret e senha do Postgres) em Preview e Production ao mesmo tempo. Production não pode apontar para o dev, Preview nunca deve receber valor de produção, e chave privilegiada não deve estar onde o app não precisa dela.

## Decisão
- Projeto `nos-plataforma` com Root Directory `apps/web`. A Vercel detecta o Turbo e roda `turbo run build` filtrado no `web`; não há `vercel.json`.
- Install: `bun install --frozen-lockfile`. Build e output: detectados (Next.js).
- Funções em `gru1` (São Paulo), perto do Supabase em `sa-east-1` (região exigida pela spec do NOS-2 para `nos-dev` e `nos-prod`).
- A integração do Supabase sai do projeto. As variáveis são criadas à mão, só as que o app lê:
  - Production, Preview e Development: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` do `nos-prod` (ADR 0009, NOS-11). Até o NOS-11, Preview e Development usavam as chaves do `nos-dev`, que deixou de existir.
  - Preview e Development recebem só essas duas chaves públicas do `nos-prod`, nunca chave privilegiada.
- Chave de servidor (service role/secret) só entra quando um card precisar dela, e só no ambiente que a usa.
- Vercel Authentication continua ligado nos previews.

## Alternativas descartadas
- Manter a integração: ela injeta todas as chaves e não permite escolher uma por uma.
- `vercel.json` com `outputDirectory`: resolve o build, mas duplica o que o Root Directory já resolve.

## Consequências
- Desde o ADR 0009, Preview lê e escreve no banco de produção com a anon key; a RLS é a barreira e o Vercel Authentication limita quem abre o preview. Chave privilegiada nunca vai para Preview, e o vazamento fica limitado ao que foi adicionado de propósito.
- Rotação de chave no Supabase exige atualizar a variável na Vercel à mão.
- Variável de servidor nova precisa entrar também no `env` do `turbo.json`, senão o Turbo a remove no build.

## Fonte
- https://vercel.com/docs/monorepos/turborepo
- https://vercel.com/docs/environment-variables/manage-across-environments
- https://turborepo.dev/docs/crafting-your-repository/using-environment-variables#platform-environment-variables
