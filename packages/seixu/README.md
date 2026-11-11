# @nos/seixu

Design system da Nós: tokens (cor, tipo, raio, espaço) e componentes base. Pacote interno, não publicado.

## Uso

```css
/* apps/web/app/globals.css */
@import "tailwindcss";
@import "@nos/seixu/tokens.css";
@source "../../../packages/seixu/src";
```

```tsx
import { Badge, Button, Input } from "@nos/seixu";
```

O tema escuro é o padrão. `data-theme="light"` no `<html>` ativa o tema claro (provisório, para o PDF). A página `/seixu` do console mostra os tokens e os componentes.

## Tokens

Há duas camadas em `src/tokens.css`:

- **Primitivos** `--seixu-*` em `:root`. Não geram utilitário e são o que cada tema redefine.
- **Semânticos** em `@theme inline`, que viram utilitários do Tailwind (`bg-surface`, `text-text-muted`…).

| Grupo     | Tokens                                                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fundo     | `bg`, `surface`, `surface-2`, `surface-3`, `border`                                                                                                |
| Texto     | `text`, `text-muted`                                                                                                                               |
| Contraste | `accent-blue`, `accent-purple`, `accent-brown`                                                                                                     |
| Estado    | `success` (Tailwind green-400), `danger` (Tailwind red-400), `danger-hover`                                                                        |
| Ação      | `action-primary`, `action-primary-hover`, `on-action`, `focus`                                                                                     |
| Fonte     | `font-sans` (Commissioner), `font-mono` (JetBrains Mono, dados e código). Sem `font-serif`.                                                        |
| Tipo      | `text-xs` a `text-3xl` em √φ: 12,6 · 14,2 · 16 · 20,4 · 25,9 · 32,9 · 41,9 px (provisório). Line-height 1,618 até `base` e 1,272 de `lg` para cima |
| Raio      | `rounded-sm` 4 px, `rounded-md` 6 px, `rounded-lg` 10 px                                                                                           |
| Espaço    | base de 4 px (`--spacing: 0.25rem`), explícito para o Seixu ser dono do valor                                                                      |

Nunca use cor literal em componente. Se a cor não existe, crie o token em `tokens.css`.

## Componentes

### Button

Use para ações. `primary` é a ação principal da tela (uma por contexto), `danger` é para ações destrutivas.

| Prop      | Tipo                                              | Padrão      | Descrição                             |
| --------- | ------------------------------------------------- | ----------- | ------------------------------------- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` | Estilo visual                         |
| `size`    | `"sm" \| "md"`                                    | `"md"`      | Altura de 32 ou 40 px                 |
| `type`    | `"button" \| "submit" \| "reset"`                 | `"button"`  | Evita submit acidental em formulários |
| demais    | `ButtonHTMLAttributes`                            | —           | Repassadas ao `<button>`              |

### Badge

Use para status e rótulos curtos, nunca para ações.

| Prop   | Tipo                                                             | Padrão      | Descrição              |
| ------ | ---------------------------------------------------------------- | ----------- | ---------------------- |
| `tone` | `"neutral" \| "blue" \| "purple" \| "brown" \| "green" \| "red"` | `"neutral"` | Cor do rótulo          |
| demais | `HTMLAttributes<HTMLSpanElement>`                                | —           | Repassadas ao `<span>` |

### Input

Use para campos de texto. O `label` é obrigatório no tipo, então um campo sem rótulo não compila. Checkbox, radio e file não são aceitos e terão componentes próprios.

| Prop    | Tipo                                                           | Padrão      | Descrição                                  |
| ------- | -------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `label` | `string`                                                       | obrigatório | Texto do `<label>` ligado ao campo         |
| `id`    | `string`                                                       | `useId()`   | Passe um `id` só se precisar referenciá-lo |
| `type`  | `InputType`: text, email, password, search, tel, url ou number | `"text"`    | Só tipos de entrada de texto               |
| demais  | `InputHTMLAttributes`                                          | —           | Repassadas ao `<input>`                    |
