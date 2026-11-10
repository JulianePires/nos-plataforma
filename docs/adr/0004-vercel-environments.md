# 0004 · Vercel: ambientes, variáveis e região

**Status:** Aceita · **Data:** 2026-11-10

## Contexto
A integração do Supabase com a Vercel injetava as 16 chaves do `nos-dev` (inclusive service role, JWT secret e senha do Postgres) em Preview e Production ao mesmo tempo. Preview não pode enxergar produção, e chave privilegiada não deve estar onde o app não precisa dela.

## Decisão
- Projeto `nos-plataforma` com Root Directory `apps/web`. A Vercel infere o `turbo build` filtrado; não há `vercel.json`.
- Install: `bun install --frozen-lockfile`. Build e output: detectados (Next.js).
- Funções em `gru1` (São Paulo), perto do Supabase em `sa-east-1`.
- A integração do Supabase sai do projeto. As variáveis são criadas à mão, só as que o app lê:
  - Preview e Development: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` do `nos-dev`.
  - Production: as mesmas chaves do `nos-prod`, adicionadas no NOS-2.
- Chave de servidor (service role/secret) só entra quando um card precisar dela, e só no ambiente que a usa.
- Vercel Authentication continua ligado nos previews.

## Alternativas descartadas
- Manter a integração: ela injeta todas as chaves e não permite escolher uma por uma.
- `vercel.json` com `outputDirectory`: resolve o build, mas duplica o que o Root Directory já resolve.

## Consequências
- Preview nunca recebe valor de produção; o vazamento de chave privilegiada fica limitado ao que foi adicionado de propósito.
- Rotação de chave no Supabase exige atualizar a variável na Vercel à mão.
- Variável de servidor nova precisa entrar também no `env` do `turbo.json`, senão o Turbo a remove no build.

## Fonte
- https://vercel.com/docs/monorepos/turborepo
- https://vercel.com/docs/environment-variables/manage-across-environments
- https://turborepo.dev/docs/crafting-your-repository/using-environment-variables#platform-environment-variables
