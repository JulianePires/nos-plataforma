# NOS-6 · Tokens do Seixu com a paleta arroxeada

**Sprint:** S0 · **Estimativa:** 2 h · **Branch:** `feat/s0-seixu-tokens`

## Objetivo
`packages/seixu` entrega tokens (cor, tipo, raio, espaço) e três componentes base (Button, Badge, Input) usados numa página de amostra do app.

## Contexto
- `packages/seixu/`, `apps/web/app/(console)/page.tsx`
- Valores de referência: paleta escura (em Requisitos) e escala tipográfica provisória baseada na proporção áurea (em Requisitos)

## Referências (context7)
- tailwindcss v4 (`@theme`, CSS variables, dark mode por `data-theme`), next/font/google

## Requisitos
- `packages/seixu/src/tokens.css` com `@theme` e as camadas do Seixu: primitivos → semânticos. O tema escuro é o padrão; o claro (para o PDF) fica com valores provisórios.
- Paleta escura: bg `#100c17`, surface `#17111f`, surface-2 `#1d1627`, surface-3 `#261d32`, border `#33283f`, text `#f2edf8`, text-2 `#a698b8`, azul `#5b8cff`, roxo `#b48cff`, marrom `#c38b5f`. Verde e vermelho (Badge green/red, Button danger) vêm da paleta padrão do Tailwind (`green-*`, `red-*`) por variável, sem hex copiado.
- Ação primária: fundo azul `#5b8cff` com texto escuro `#100c17` (texto branco reprova no AA).
- Escala tipográfica provisória em √φ (≈ 1,272) com base 16 px, de modo que dois degraus multiplicam por φ: 12,6 · 14,2 · 16 · 20,4 · 25,9 · 32,9 · 41,9 px. Line-height 1,618 no corpo e 1,272 nos títulos.
- Fontes: Commissioner (UI) e JetBrains Mono (dados e código) via `next/font/google` (ADR 0008). **Nenhuma fonte com serifa** e nenhum fallback serifado.
- Componentes `Button` (primary, secondary, ghost, danger; sm, md), `Badge` (neutral, blue, purple, brown, green, red) e `Input` (com label obrigatório), com props do Seixu e sem cor literal.
- Página `/seixu` no console mostrando os tokens e os 3 componentes.
- `packages/seixu/README.md` com tabela de props de cada componente.

## Fora de escopo
- Modal, Toast, Table, Tabs e os componentes novos (entram quando forem usados).

## Cenários (BDD)
```gherkin
Funcionalidade: Componentes base do Seixu

  Cenário: Botão primário usa o token de ação
    Dado um <Button variant="primary">Salvar</Button>
    Quando ele renderiza
    Então o fundo vem de "--color-action-primary"
    E não há cor hexadecimal no className

  Cenário: Input sem label não compila
    Dado um <Input /> sem a prop "label"
    Então "bun run typecheck" falha

  Cenário: Botão acessível pelo teclado
    Dado a página "/seixu"
    Quando navego com Tab até "Salvar"
    Então o foco fica visível

  Cenário: Só fontes sem serifa
    Dado a página "/seixu"
    Então nenhum elemento tem font-family com "serif" exceto "sans-serif"
```

## Critérios de aceite
- [ ] Testes de componente com Testing Library para variantes e label
- [ ] Contraste AA do texto primário e do botão primário no tema escuro
- [ ] Nenhuma cor literal fora de `tokens.css` (`rg "#[0-9a-fA-F]{3,6}" packages/seixu/src --glob '!tokens.css'` vazio)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Botão usa token / variantes | unit (Vitest + Testing Library) | `packages/seixu/src/button.test.tsx` |
| Input exige label | typecheck (`@ts-expect-error` no teste) | `packages/seixu/src/input.test.tsx` |
| Foco e fontes | e2e simples ou verificação manual no PR | `apps/web/tests/seixu.spec.ts` (se o Playwright já estiver pronto) |

## Limites
- Até 20 arquivos. Dependências: @testing-library/react, @testing-library/jest-dom, jsdom (dev).
