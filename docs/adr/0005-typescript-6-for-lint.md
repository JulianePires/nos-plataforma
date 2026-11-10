# 0005 · TypeScript 6 só para o lint, TypeScript 7 no resto

**Status:** Aceita · **Data:** 2026-11-10

## Contexto
O repo usa o TypeScript 7 nativo (Go), que não traz a API em JavaScript. O typescript-eslint precisa dessa API para o lint com tipos (`strictTypeChecked`) e só aceita `typescript >=4.8.4 <6.1.0`.

## Decisão
- `apps/web` fica com `typescript@7.0.2`: `tsc` do `typecheck` e o Next usam ele.
- A raiz fixa `typescript@6.0.3`, que é o que o ESLint e o typescript-eslint resolvem a partir da raiz. Sem alias: cada lado resolve o `typescript` do próprio `node_modules`.
- O `tsconfig.json` da raiz cobre `packages/*/src`, porque o `projectService` procura o tsconfig mais próximo de cada arquivo e os pacotes não têm um (ADR 0002).
- O `tsconfig.json` do `apps/web` inclui `../../packages/*/src`, para o `tsc` 7 checar também arquivo de pacote que ninguém importa.

## Alternativas descartadas
- Voltar o repo inteiro para o TypeScript 6: um compilador só, mas perde a velocidade do 7 no `typecheck` e no editor.
- Lint sem tipos (`strict`): funciona com o 7, mas descumpre o `strictTypeChecked` da spec do NOS-4.

## Consequências
- Os dois compiladores podem discordar num caso de borda; o `typecheck` (TS 7) é a fonte de verdade sobre tipos, o lint só aplica regras.
- Atualizar o TypeScript exige mexer em dois `package.json`.
- Quando o typescript-eslint suportar o tsgo, volta a um compilador só e este ADR é substituído.

## Fonte
- https://typescript-eslint.io/users/dependency-versions/#typescript
- https://typescript-eslint.io/blog/project-service/
