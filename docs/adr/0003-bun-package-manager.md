# 0003 · Bun como gerenciador de pacotes no lugar do pnpm

**Status:** Aceita · **Data:** 2026-11-10

## Contexto
O ADR 0001 previa um monorepo pnpm, mas o repositório já instala e roda com Bun (`bun.lock`, `devEngines.packageManager` = bun 1.4.4). As specs e a documentação ainda falam em pnpm.

## Decisão
- Bun é o gerenciador de pacotes e o executor de scripts: `bun install`, `bun run <script>`, `bunx <bin>`.
- Workspaces declarados no campo `workspaces` do `package.json` da raiz (não há `pnpm-workspace.yaml`); dependência interna via `workspace:*`.
- `bun.lock` (texto) é versionado. No CI, `bun ci` (equivale a `bun install --frozen-lockfile`) com `oven-sh/setup-bun`.
- O Next.js continua rodando no Node (`engines.node >= 24`); o Bun entra só como gerenciador e executor de scripts.

## Alternativas descartadas
- Voltar para pnpm: exige migrar o lockfile e a config já em uso, sem ganho para um projeto sem pacotes publicados.
- npm workspaces: instalação mais lenta e sem lockfile de texto tão legível quanto o `bun.lock`.

## Consequências
- Uma ferramenta a menos para instalar (Bun já traz o gerenciador de pacotes).
- Specs, `CLAUDE.md`, `docs/context/INDEX.md` e o script de tamanho de PR passam a usar Bun e `bun.lock`.
- Changesets roda via `bun run changeset` (NOS-7); a Vercel detecta o Bun pelo `bun.lock`.

## Fonte
- https://bun.com/docs/pm/workspaces
- https://bun.com/docs/pm/cli/install (CI/CD, `bun ci`)
