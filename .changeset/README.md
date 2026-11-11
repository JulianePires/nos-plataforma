# Changesets

Registro de mudanças dos pacotes internos em `packages/*`. Nada é publicado no npm: os pacotes são privados e o Changesets só sobe a versão e escreve o `CHANGELOG.md` de cada um.

- PR que mexe em `packages/*`: rode `bun run changeset`, escolha o pacote e o tipo de bump (patch, minor, major) e descreva a mudança.
- Para aplicar os changesets pendentes: `bun run changeset version` e, em seguida, `bun install`. O `bun.lock` guarda a versão de cada workspace e o `changeset version` não o atualiza: commite o `bun.lock` junto com as versões e os CHANGELOGs.
- `apps/web` fica fora (`ignore` em `config.json`).

Doc: https://github.com/changesets/changesets
