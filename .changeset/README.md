# Changesets

Registro de mudanças dos pacotes internos em `packages/*`. Nada é publicado no npm: os pacotes são privados e o Changesets só sobe a versão e escreve o `CHANGELOG.md` de cada um.

- PR que mexe em `packages/*`: rode `bun run changeset`, escolha o pacote e o tipo de bump (patch, minor, major) e descreva a mudança.
- Para aplicar os changesets pendentes: `bun run changeset version`.
- `apps/web` fica fora (`ignore` em `config.json`).

Doc: https://github.com/changesets/changesets
