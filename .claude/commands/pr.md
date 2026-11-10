---
description: Gera a mensagem de commit, o título e a descrição da PR. Não faz commit sozinho.
---
Rode `scripts/check-pr-size.sh`. Se passar de 20 arquivos, PARE e proponha como dividir.

Se estiver dentro do limite, gere em inglês, prontos para copiar:

**Commit** (Conventional Commits; corpo com o porquê, ≤ 72 colunas):
```
<type>(<scope>): <summary>

<why, 1-3 lines>

Refs: <card ID, ex. NOS-3>
```

**PR title:** `<type>(<scope>): <summary>` (≤ 70 caracteres)

**PR description:**
```
## What
- <bullet points of the change>

## Why
<1-2 lines linked to the spec>

## How to test
1. <steps on the Vercel preview>

## Acceptance
- [x] <each acceptance criterion from the spec>

## Notes
- ADR: <link or "none">
- Files changed: <n>/20
```

Não rode `git commit` nem abra a PR sem eu pedir.
