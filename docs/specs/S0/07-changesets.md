# NOS-7 · Changesets para os pacotes internos

**Sprint:** S0 (fechamento) · **Estimativa:** 1 h · **Branch:** `chore/s0-changesets`

## Objetivo
O monorepo usa Changesets para versionar e registrar mudanças em `packages/*`, sem publicar nada no npm.

## Contexto
- `package.json`, `packages/*/package.json`, `.github/workflows/ci.yml`

## Referências (context7)
- changesets (config para pacotes privados, `privatePackages`), bun workspaces

## Requisitos
- `@changesets/cli` como devDependency da raiz, com `.changeset/config.json` inicializado.
- Pacotes internos continuam com `"private": true`. Nenhum passo de publish.
- Versão e changelog gerados para pacotes privados (`privatePackages.version: true`, `tag: false`).
- Script `bun run changeset` na raiz.
- `CLAUDE.md` volta a exigir changeset quando a PR mexer em `packages/*`.

## Fora de escopo
- Publicar pacotes, release automático, bot de changeset no CI.

## Cenários (BDD)
```gherkin
Funcionalidade: Versionamento de pacotes internos

  Cenário: Mudança num pacote interno gera changelog
    Dado um changeset que altera "packages/seixu" com bump patch
    Quando eu rodo "bun run changeset version"
    Então a versão de "packages/seixu" sobe um patch
    E "packages/seixu/CHANGELOG.md" registra a mudança

  Cenário: Nada é publicado
    Dado que todos os pacotes de "packages/*" são privados
    Quando eu rodo "bun run changeset publish --dry-run"
    Então nenhum pacote é publicado
```

## Critérios de aceite
- [ ] `bun run changeset` cria um arquivo em `.changeset/`.
- [ ] `bun run changeset version` atualiza versão e CHANGELOG do pacote afetado.
- [ ] Nenhum pacote sem `"private": true`.

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Changelog gerado | script | manual no PR (saída do `changeset version`) |
| Nada publicado | script | manual no PR (saída do `--dry-run`) |

## Limites
- Até 20 arquivos. Dependência nova: só `@changesets/cli`.
