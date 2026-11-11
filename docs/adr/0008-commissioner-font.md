# 0008 · Commissioner como fonte de UI do Seixu

**Status:** Aceita · **Data:** 2026-11-11

## Contexto

O Seixu previa DM Sans para a UI e JetBrains Mono para dados e código. No NOS-6, a Commissioner foi escolhida para a interface por decisão de produto. A regra "nunca use fonte com serifa" continua valendo.

## Decisão

- A UI usa **Commissioner** (Google Fonts, variável), carregada por `next/font/google` com `variable: "--font-commissioner"`.
- **JetBrains Mono** continua para dados e código (`--font-mono`).
- A pilha de `--font-sans` termina em `ui-sans-serif, system-ui, sans-serif`. Nenhum fallback serifado, e `--font-serif` fica desligado no `@theme`.

## Alternativas descartadas

- DM Sans: era o plano original e foi substituída por escolha de produto.
- Fonte self-hosted com `next/font/local`: obriga a versionar arquivos de fonte sem ganho, porque a Commissioner já está no Google Fonts.

## Consequências

- `CLAUDE.md` e a spec do NOS-6 passam a citar Commissioner.
- Como a Commissioner é variável, um arquivo só cobre todos os pesos.

## Fonte

- https://nextjs.org/docs/app/api-reference/components/font
- https://fonts.google.com/specimen/Commissioner
