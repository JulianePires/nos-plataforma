# NOS-1 + NOS-5 · Repositório e kit do Claude Code

**Sprint:** S0 · **Estimativa:** 1,5 h · **Branch:** `chore/s0-repo-kit`

## Objetivo
O repo `nos-plataforma` existe no GitHub com o kit do Claude Code (CLAUDE.md, comandos, subagente, MCPs, ADR 0001) na `main`.

## Contexto
- `CLAUDE.md`, `.claude/`, `.mcp.json`, `docs/`, `scripts/check-pr-size.sh` (vindos do kit)

## Referências (context7)
- nenhuma

## Requisitos
- `README.md` curto: o que é, como rodar (vai crescer nos próximos cards), link para `docs/context/INDEX.md`.
- `.gitignore` para Node, Next, Turbo, Supabase e `.env*` (exceto `.env.example`).
- `.env.example` com `SUPABASE_DEV_PROJECT_REF=` e `GITHUB_PAT=` vazios.
- Proteção da `main`: merge só via PR (configurada por você no GitHub).

## Fora de escopo
- Qualquer código de app, CI, Supabase ou Vercel.

## Cenários (BDD)
```gherkin
Funcionalidade: Kit do Claude Code no repositório

  Cenário: Segredos não entram no git
    Dado que existe um arquivo ".env.local" na raiz
    Quando eu rodo "git status"
    Então ".env.local" não aparece como arquivo novo
    E ".env.example" é rastreado

  Cenário: Limite de arquivos por PR
    Dado uma branch com 21 arquivos alterados
    Quando eu rodo "scripts/check-pr-size.sh"
    Então o script termina com erro e lista os arquivos

  Cenário: Lockfile não conta no limite
    Dado uma branch com 20 arquivos alterados e o "bun.lock"
    Quando eu rodo "scripts/check-pr-size.sh"
    Então o script termina com sucesso e mostra "20/20"
```

## Critérios de aceite
- [ ] `claude` aberto na raiz lista os comandos `/card`, `/tdd`, `/review`, `/pr`, `/adr`
- [ ] `/mcp` mostra context7, supabase, github, vercel e figma (autenticar cada um uma vez)
- [ ] `scripts/check-pr-size.sh` é executável (`chmod +x`)

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Limite de arquivos / lockfile | script (bats ou teste manual descrito no PR) | `scripts/check-pr-size.sh` |
| Segredos fora do git | manual | `.gitignore` |

## Limites
- Até 20 arquivos. Nenhuma dependência.
