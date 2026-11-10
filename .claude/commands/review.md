---
description: Autoanálise do que foi implementado antes de confirmar. Usa o subagente reviewer.
---
Antes de confirmar qualquer coisa, delegue ao subagente `reviewer` a análise de `git diff main...HEAD` e `git status`, contra a spec do card.

Depois me devolva, em no máximo 15 linhas:
- ✅/❌ para cada critério de aceite da spec
- ✅/❌ para cada cenário Gherkin (com o teste que o cobre)
- Problemas encontrados (bug, segurança/RLS, duplicação, overengineering, comentário inútil, a11y), cada um com arquivo:linha
- Contagem de arquivos alterados (`scripts/check-pr-size.sh`)
- Se precisa de ADR ou de atualizar `docs/context/INDEX.md` ou `packages/seixu/README.md`

Corrija o que for ❌ e rode a análise de novo. Só diga que está pronto quando tudo estiver ✅. Aí sugira `/pr`.
