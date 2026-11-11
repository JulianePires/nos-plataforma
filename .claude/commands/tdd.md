---
description: Implementa o plano aprovado em ciclos red → green → refactor (BDD + TDD).
argument-hint: <cenário ou passo do plano, opcional>
---
Plano aprovado. Implemente $ARGUMENTS (ou o plano inteiro, se vazio) assim:

1. **Red:** escreva o teste do próximo cenário Gherkin da spec. Rode e mostre só a linha da falha.
2. **Green:** implemente o mínimo para passar. Rode de novo.
3. **Refactor:** remova duplicação e nomes ruins sem mudar comportamento. Testes continuam verdes.
4. Repita até cobrir todos os cenários. Um cenário por ciclo.

Regras:
- Não crie arquivo fora do plano sem me avisar e explicar o motivo.
- Antes de criar função ou componente, rode `rg` atrás de um existente.
- Sem comentários óbvios. Sem lib nova fora do plano.
- Se um teste exigir mudar a spec, pare e me pergunte.
- Ao final, rode `bun run lint && bun run typecheck && bun run test` e mostre só o resumo.
- NÃO faça commit. Termine sugerindo `/review`.
