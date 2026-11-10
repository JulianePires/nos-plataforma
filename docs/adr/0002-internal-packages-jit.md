# 0002 · Pacotes internos sem build próprio (just-in-time)

**Status:** Proposta (passa a Aceita no NOS-3) · **Data:** 2026-11-10

## Contexto
`packages/{seixu,pricing,db}` são internos e não são publicados (ADR 0001). Um passo de build por pacote soma config e tempo para uma pessoa só manter.

## Decisão
- Cada pacote aponta `exports` direto para `src/index.ts`, sem build nem `dist/`.
- `apps/web` transpila os pacotes via `transpilePackages` no `next.config.js` e faz o typecheck deles junto com o próprio código.
- Escopo `@nos/*`, dependência via `workspace:*`. O tsconfig compartilhado fica em `packages/typescript-config`.
- O boilerplate do `create-turbo` (`apps/docs`, `packages/ui`, `packages/eslint-config`) sai. O ESLint volta no card 03.

## Alternativas descartadas
- Pacotes compilados (`tsc` para `dist/`): build e watch extras sem ganho, já que nada é publicado.
- TypeScript project references: mais config, e o consumidor já transpila.

## Consequências
- Zero build nos pacotes; uma mudança no pacote aparece direto no `bun run dev`.
- O Turbo não faz cache de build dos pacotes. Um erro de tipo num pacote quebra o typecheck do `apps/web`, o que é intencional.
- Pacote não pode usar `paths` do TypeScript; se precisar de alias interno, use subpath imports do Node.

## Fonte
- https://turborepo.dev/docs/core-concepts/internal-packages#just-in-time-packages
- https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
