# 0006 · Biome para formatação e lint sem tipos

**Status:** Aceita (NOS-8, 2026-11-11) · **Data:** 2026-11-10

## Contexto
Hoje o Prettier formata e o ESLint faz todo o lint, inclusive regras que não precisam de tipos. O ESLint com `strictTypeChecked` é lento por depender do TypeScript 6 (ADR 0005), e o Prettier é uma segunda ferramenta só para formatação.

## Decisão
- Biome (`@biomejs/biome`) substitui o Prettier na formatação e assume as regras de lint que não dependem de tipos.
- O ESLint fica só com o que o Biome não cobre: regras type-aware do typescript-eslint (`strictTypeChecked`) e o plugin do Next (`core-web-vitals`).
- Cada regra tem um dono só. Regra que existe nos dois fica ligada em um e desligada no outro (tabela abaixo).
- Biome respeita o `.gitignore` (`vcs.enabled` + `vcs.useIgnoreFile`) e ignora arquivo gerado (`packages/db/src/database.types.ts`).
- No CI, `biome ci` roda antes do ESLint, no mesmo job `ci`.

## Donos das regras
Critério, aplicado às 97 regras que o ESLint ligava antes do NOS-8 e ao mapa de equivalência do `biome migrate eslint`:
1. Regra do ESLint que exige tipos: dono ESLint; o equivalente no Biome fica desligado.
2. Equivalente idêntico e sem tipos: dono Biome; desligada no ESLint (`biomeOwnedRules` em `eslint.config.mjs`).
3. Regra do plugin do Next: dono ESLint.
4. Equivalente só "inspirado" (cobre menos que a do ESLint): dono ESLint, para não perder cobertura; desligada no Biome.

| Regra do ESLint | Regra do Biome | Dono |
| --- | --- | --- |
| `@typescript-eslint/no-explicit-any` | `suspicious/noExplicitAny` | Biome |
| `no-console` (permite `console.error`) | `suspicious/noConsole` (`allow: ["error"]`) | Biome |
| `@typescript-eslint/no-unused-vars` | `correctness/noUnusedVariables`, `noUnusedImports`, `noUnusedFunctionParameters` | Biome |
| `prefer-const` | `style/useConst` | Biome |
| `no-var` | `suspicious/noVar` | Biome |
| `prefer-rest-params` | `complexity/noArguments` | Biome |
| `prefer-spread` | `style/useSpreadOverApply` | Biome |
| `@typescript-eslint/no-array-constructor` | `style/useArrayLiterals` | Biome |
| `@typescript-eslint/no-duplicate-enum-values` | `suspicious/noDuplicateEnumValues` | Biome |
| `@typescript-eslint/no-extra-non-null-assertion` | `suspicious/noExtraNonNullAssertion` | Biome |
| `@typescript-eslint/no-extraneous-class` | `complexity/noStaticOnlyClass` | Biome |
| `@typescript-eslint/no-invalid-void-type` | `suspicious/noConfusingVoidType` | Biome |
| `@typescript-eslint/no-misused-new` | `suspicious/noMisleadingInstantiator` | Biome |
| `@typescript-eslint/no-namespace` | `style/noNamespace` | Biome |
| `@typescript-eslint/no-non-null-asserted-optional-chain` | `suspicious/noNonNullAssertedOptionalChain` | Biome |
| `@typescript-eslint/no-non-null-assertion` | `style/noNonNullAssertion` | Biome |
| `@typescript-eslint/no-require-imports` | `style/noCommonJs` | Biome |
| `@typescript-eslint/no-unnecessary-type-constraint` | `complexity/noUselessTypeConstraint` | Biome |
| `@typescript-eslint/no-unsafe-declaration-merging` | `suspicious/noUnsafeDeclarationMerging` | Biome |
| `@typescript-eslint/no-useless-constructor` | `complexity/noUselessConstructor` | Biome |
| `@typescript-eslint/prefer-as-const` | `style/useAsConstAssertion` | Biome |
| `@typescript-eslint/prefer-literal-enum-member` | `style/useLiteralEnumMembers` | Biome |
| `@typescript-eslint/prefer-namespace-keyword` | `suspicious/useNamespaceKeyword` | Biome |
| `@typescript-eslint/unified-signatures` | `style/useUnifiedTypeSignatures` | Biome |
| `@typescript-eslint/ban-ts-comment` | `suspicious/noTsIgnore` (inspirada) | ESLint |
| `@typescript-eslint/no-empty-object-type`, `no-unsafe-function-type`, `no-wrapper-object-types` | `complexity/noBannedTypes` (inspirada) | ESLint |
| `@typescript-eslint/no-this-alias` | `complexity/noUselessThisAlias` (inspirada) | ESLint |
| `@typescript-eslint/no-deprecated` | `suspicious/noDeprecatedImports` | ESLint (tipos) |
| `@typescript-eslint/no-for-in-array` | `suspicious/noForIn` | ESLint (tipos) |
| `@typescript-eslint/no-mixed-enums` | `style/useConsistentEnumValueType` | ESLint (tipos) |
| `@typescript-eslint/no-unnecessary-condition` | `suspicious/noUnnecessaryConditions` | ESLint (tipos) |
| `@typescript-eslint/no-unnecessary-template-expression` | `complexity/noUnnecessaryTemplateExpression` | ESLint (tipos) |
| `@typescript-eslint/only-throw-error` | `style/useThrowOnlyError` | ESLint (tipos) |
| `@typescript-eslint/prefer-reduce-type-parameter` | `style/useReduceTypeParameter` | ESLint (tipos) |
| `@typescript-eslint/require-await` | `suspicious/useAwait` | ESLint (tipos) |
| `@next/next/*` (core-web-vitals) | domínio `next` do Biome (`linter.domains.next: "none"`) e `suspicious/useGoogleFontDisplay`, que é do recommended | ESLint |

Regras do `recommended` do Biome sem equivalente ligado no ESLint ficam só no Biome. O restante do `strictTypeChecked` (regras com tipos sem equivalente no Biome) fica só no ESLint.

Como conferir: `eslint --print-config <arquivo>` lista as regras ligadas no ESLint; cruze com a tabela acima antes de ligar uma regra nova em qualquer um dos dois.

## Alternativas descartadas
- Biome só como formatter: troca o Prettier, mas mantém o ESLint lento rodando regras que o Biome faria mais rápido.
- Biome no lugar do ESLint: perde o lint com tipos (`strictTypeChecked`) e o plugin do Next, que a spec do NOS-4 exige.

## Consequências
- Formatação e lint básico em milissegundos; o ESLint fica menor e com uma responsabilidade só.
- Duas ferramentas de lint para manter, com risco de regra duplicada ou esquecida; a tabela de donos das regras mitiga.
- A primeira passada do `bun run format` mudou 8 arquivos: quebra de linha em 80 colunas, `.mcp.json` de tab para 2 espaços e ordem dos imports em dois arquivos (o `organizeImports` do Biome, que também falha o `check`). Aspas, ponto e vírgula e indentação seguem o estilo que já existia.
- `lineEnding: "auto"`: o repo usa `core.autocrlf`, então o checkout no Windows tem CRLF e o CI tem LF. `auto` é CRLF no Windows e LF no resto, sem olhar o arquivo: arquivo novo gravado com LF no Windows falha no `check` até rodar `bun run format`, e um clone com `core.autocrlf=false` no Windows falha no repo inteiro. Se isso incomodar, a saída é `* text=auto eol=lf` no `.gitattributes` com `lineEnding: "lf"`.
- Markdown fica fora do Biome (`markdown.formatter` e `markdown.linter` desligados): o Prettier não era aplicado aos `.md` na prática, e formatá-los agora mudaria dezenas de arquivos sem ganho.

## Fonte
- https://biomejs.dev/installation/migrate-from-other-tools/
- https://biomejs.dev/configuration/integrate-with-vcs/
