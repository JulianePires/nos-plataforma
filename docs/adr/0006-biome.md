# 0006 · Biome para formatação e lint sem tipos

**Status:** Proposta (passa a Aceita no NOS-8) · **Data:** 2026-11-10

## Contexto
Hoje o Prettier formata e o ESLint faz todo o lint, inclusive regras que não precisam de tipos. O ESLint com `strictTypeChecked` é lento por depender do TypeScript 6 (ADR 0005), e o Prettier é uma segunda ferramenta só para formatação.

## Decisão
- Biome (`@biomejs/biome`) substitui o Prettier na formatação e assume as regras de lint que não dependem de tipos.
- O ESLint fica só com o que o Biome não cobre: regras type-aware do typescript-eslint (`strictTypeChecked`) e o plugin do Next (`core-web-vitals`).
- Cada regra tem um dono só. Regra que existe nos dois fica ligada em um e desligada no outro; a lista fica neste ADR quando o NOS-8 for implementado.
- Biome respeita o `.gitignore` (`vcs.useIgnoreFile`) e ignora arquivo gerado (`packages/db/src/database.types.ts`).
- No CI, `biome ci` roda antes do ESLint, no mesmo job `ci`.

## Alternativas descartadas
- Biome só como formatter: troca o Prettier, mas mantém o ESLint lento rodando regras que o Biome faria mais rápido.
- Biome no lugar do ESLint: perde o lint com tipos (`strictTypeChecked`) e o plugin do Next, que a spec do NOS-4 exige.

## Consequências
- Formatação e lint básico em milissegundos; o ESLint fica menor e com uma responsabilidade só.
- Duas ferramentas de lint para manter, com risco de regra duplicada ou esquecida; a tabela de donos das regras mitiga.
- A primeira formatação do repo pode alterar muitos arquivos; o NOS-8 configura o Biome para seguir o estilo atual e minimizar o diff.

## Fonte
- https://biomejs.dev/installation/migrate-from-other-tools/
- https://biomejs.dev/configuration/integrate-with-vcs/
