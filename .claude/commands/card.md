---
description: Inicia um card: lê a spec, faz perguntas e propõe o plano (SDD). Não escreve código.
argument-hint: <caminho da spec, ex. docs/specs/S0/03-monorepo-scaffold.md>
---
Card de hoje: @$ARGUMENTS

Siga o fluxo do CLAUDE.md, só até o passo 3:

1. Leia apenas a spec acima e os arquivos que ela lista em "Contexto". Não explore o repo além disso.
2. Se algo na spec estiver ambíguo e mudar a implementação, faça até 3 perguntas objetivas e PARE.
3. Se estiver claro, consulte o context7 só para as libs listadas em "Referências" e devolva:
   - **Plano:** lista de arquivos (criar/alterar), com 1 linha de motivo cada. Total ≤ 20.
   - **Testes primeiro:** qual cenário Gherkin vira qual teste e em qual arquivo.
   - **Decisões:** escolhas não óbvias + fonte em 1 linha. Marque se precisa de ADR.
   - **Fora de escopo:** o que você NÃO vai fazer.
4. Espere eu responder "aprovado" antes de qualquer código.
