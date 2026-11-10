# 0001 · Stack da plataforma

**Status:** Aceita · **Data:** 2026-11-09

## Contexto
Dev solo, 10 h/semana, um app com console interno e portal do cliente. O isolamento entre clientes precisa ser garantido no banco. O piloto com cliente real é em 11/01/2027.

## Decisão
- Next.js (App Router) num monorepo pnpm + Turborepo (gerenciador substituído por Bun no ADR 0003): `apps/web` + `packages/{seixu,pricing,db}`
- Supabase: Auth (Google para a equipe, magic link para clientes), Postgres com RLS, Realtime e Storage
- Tailwind v4 com os tokens do Seixu; Zod nas bordas; Vitest, Playwright e pgTAP
- Vercel com preview por PR. Hobby e Free no desenvolvimento; Pro em produção a partir da S6 (o Hobby não permite uso comercial)

## Alternativas descartadas
- Front e back separados (Vite + Nest): dobra o setup e o deploy para uma pessoa só
- Firebase: regras de segurança fora do SQL e sem pgTAP para testar isolamento

## Consequências
- Um deploy só, tipos compartilhados do banco ao componente
- A segurança depende de RLS bem testada: nenhuma tabela entra sem policy e pgTAP

## Fonte
- Documento de arquitetura: https://claude.ai/code/artifact/22b8ec3b-a73b-4c96-bab5-50957ab6a642
