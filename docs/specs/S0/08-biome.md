# NOS-8 · Biome para formatação e lint sem tipos

**Sprint:** S0 (fim, antes da S1) · **Estimativa:** 1,5 h · **Branch:** `chore/s0-biome`

## Objetivo
O Biome formata o repo e roda o lint que não depende de tipos; o ESLint fica só com as regras type-aware e o plugin do Next. O Prettier sai.

## Contexto
- `package.json`, `eslint.config.mjs`, `.github/workflows/ci.yml`
- `docs/adr/0005-typescript-6-for-lint.md`, `docs/adr/0006-biome.md`

## Referências (context7)
- biome (`biome.json`, `biome migrate prettier`, `biome ci`, integração com VCS), typescript-eslint (desligar regras que o Biome passa a cobrir)

## Requisitos
- `@biomejs/biome` como devDependency da raiz, versão exata; `prettier` e o script `format` atual saem.
- `biome.json` na raiz com `vcs.useIgnoreFile: true`, formatter seguindo o estilo atual do código (aspas duplas, ponto e vírgula, 2 espaços) e linter `recommended`.
- `packages/db/src/database.types.ts` ignorado pelo Biome, como já é pelo ESLint.
- Scripts na raiz: `bun run format` (formata e corrige) e `bun run check` (só verifica, sem escrever).
- Cada regra com um dono só: as regras que existem nos dois ficam ligadas em um e desligadas no outro. A tabela de donos entra no ADR 0006.
- As regras do NOS-4 continuam bloqueando: `any` explícito e `console.log` (com `console.error` permitido). Se forem para o Biome, o cenário do NOS-4 passa a citar o nome da regra do Biome.
- CI: passo `Biome` com `bunx biome ci .` antes do passo `Lint`, no mesmo job `ci`.
- `CLAUDE.md` (Comandos e Código), `README.md` e `docs/context/INDEX.md` atualizados; ADR 0006 passa a Aceita.

## Fora de escopo
- Trocar o lint type-aware do ESLint (ADR 0005 continua valendo).
- Pre-commit hook (lefthook/husky): só se virar card próprio.

## Cenários (BDD)
```gherkin
Funcionalidade: Formatação e lint rápidos

  Cenário: Arquivo mal formatado é bloqueado
    Dado uma PR com um arquivo fora do padrão de formatação
    Quando o CI roda
    Então o passo "Biome" falha citando o arquivo

  Cenário: Formatar corrige o arquivo
    Dado um arquivo fora do padrão
    Quando eu rodo "bun run format"
    Então "bun run check" passa

  Cenário: Regra type-aware continua no ESLint
    Dado uma PR com uma Promise sem await nem tratamento
    Quando o CI roda
    Então o passo "Lint" falha citando "no-floating-promises"

  Cenário: Regras do NOS-4 continuam valendo
    Dado uma PR com "const x: any = 1"
    Quando o CI roda
    Então o job "ci" falha citando a regra de any explícito
```

## Critérios de aceite
- [ ] Prettier removido; nenhum arquivo de config do Prettier sobrando
- [ ] Nenhuma regra ligada no Biome e no ESLint ao mesmo tempo (tabela no ADR 0006)
- [ ] CI continua abaixo de 4 minutos
- [ ] Os cenários comprovados com PRs de teste (fechadas sem merge) ou descritos no PR

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Formatação e regras | PR de teste | `.github/workflows/ci.yml` |
| `format` corrige | comando, evidência no PR | — |

## Limites
- Até 20 arquivos. Se a primeira formatação passar disso, a reformatação vai numa PR própria, só com o resultado do `bun run format`. Dependência: `@biomejs/biome` (sai `prettier`).
