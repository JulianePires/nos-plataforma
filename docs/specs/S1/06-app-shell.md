# NOS-17 · Layout base do console e do portal

**Sprint:** S1 · **Estimativa:** 2 h · **Branch:** `feat/s1-app-shell`

## Objetivo
O console tem sidebar, topbar e gaveta no celular, com o nome de quem está logado e "Sair". O portal tem um cabeçalho simples. Os dois seguem o protótipo Nós Console.

## Contexto (o Claude lê só isto)
- `apps/web/app/(console)/layout.tsx`, `apps/web/app/(portal)/layout.tsx`, `apps/web/features/auth/` (`getCurrentUser`, `signOut`)
- `packages/seixu/src/index.ts`, `packages/seixu/README.md`, `packages/seixu/src/tokens.css`
- Referência visual: telas "Dashboard" e "Cliente" do protótipo (link em `docs/context/INDEX.md`)

## Referências (context7)
- next.js 16 (`usePathname`, `Link`), testing-library react, wai-aria (disclosure de navegação)

## Requisitos
- `apps/web/components/shell/`: `console-shell.tsx` (sidebar 232 px no desktop; topbar + gaveta abaixo de 760 px), `portal-header.tsx`, `user-menu.tsx` (nome + "Sair").
- Navegação do console só com rotas que existem: **Início** (`/`) e **Seixu** (`/seixu`), num grupo "Sistema". Projetos entra na S2, junto com a rota. Nada de item desabilitado "em breve".
- Item ativo com `aria-current="page"` e o marcador lateral do protótipo.
- Gaveta: botão com `aria-expanded` e `aria-controls`; fecha com Esc, com clique fora e ao navegar; o foco volta para o botão ao fechar.
- Só tokens do Seixu, sem cor literal. Componentes nascem em `apps/web`; sobem para o Seixu quando estabilizarem (S17 no plano).
- `apps/web` ganha o setup de testes de componente (jsdom + Testing Library), espelhando o do `packages/seixu`.

## Fora de escopo
- Troca de tema claro/escuro.
- Itens de menu para módulos que ainda não existem.

## Cenários (BDD)
```gherkin
Funcionalidade: Navegar pelo console

  Cenário: Item ativo marcado
    Dado que estou em "/seixu"
    Então o link "Seixu" tem aria-current="page"
    E o link "Início" não tem

  Cenário: Usuário identificado
    Dado "equipe@nos.local" com sessão
    Então o menu do usuário mostra o nome dele e o botão "Sair"

  Cenário: Gaveta no celular
    Dado a tela com 390 px de largura
    Quando eu aciono "Abrir menu"
    Então a navegação aparece e o botão fica com aria-expanded="true"
    Quando eu aperto Esc
    Então a navegação fecha e o foco volta para "Abrir menu"

  Cenário: Portal sem menu do console
    Dado "cliente@nos.local" em "/portal"
    Então não existe navegação para "Seixu"
```

## Critérios de aceite
- [ ] Sem rolagem horizontal em 390 px e 1360 px
- [ ] Zero violações axe *serious* nas duas larguras (extensão axe no navegador, print no PR)
- [ ] `packages/seixu` sem mudança (componentes do shell ficam no app)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Item ativo | componente (Testing Library, `usePathname` mockado) | `apps/web/components/shell/console-shell.test.tsx` |
| Gaveta, Esc, foco | componente | `apps/web/components/shell/console-shell.test.tsx` |
| Usuário identificado | componente | `apps/web/components/shell/user-menu.test.tsx` |
| Portal sem navegação do console | componente | `apps/web/components/shell/portal-header.test.tsx` |

## Limites
- Até 15 arquivos. Dependências (dev, em `apps/web`): @testing-library/react, @testing-library/user-event, jsdom, nas mesmas versões do `packages/seixu`.
