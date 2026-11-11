# NOS-12 · pgTAP no CI e finais de linha

**Sprint:** S1 · **Estimativa:** 1 h · **Branch:** `chore/s1-pgtap-ci`

## Objetivo
Toda PR roda as migrations num Supabase local e os testes pgTAP, e só faz merge com o banco verde. O repo para de acusar arquivos alterados só por final de linha.

## Contexto (o Claude lê só isto)
- `.github/workflows/ci.yml`, `.gitattributes`, `supabase/config.toml` (só `[api]`, `[db]` e a lista de serviços), `supabase/tests/`
- `docs/specs/backlog.md` (item "pgTAP no CI")

## Referências (context7)
- supabase cli (`supabase start -x`, `supabase test db`), github actions (jobs paralelos)

## Requisitos
- Origem: backlog, item do NOS-4 com destino S1.
- Job novo `db` em `.github/workflows/ci.yml`, em paralelo ao `ci`: instala com `bun ci`, sobe o Supabase com `bunx supabase start` excluindo o que o teste não usa (Studio, imgproxy, edge runtime, logflare, vector), e roda `bunx supabase test db`.
- `timeout-minutes` do job `db` próprio (o `ci` continua em 10).
- `.gitattributes`: `* text=auto eol=lf` (o `*.sh` atual fica coberto). Depois do merge, você roda `git add --renormalize .` numa PR à parte, se aparecerem arquivos só com CRLF.
- Você marca o check `db` como obrigatório na proteção da `main`.

## Fora de escopo
- Testes novos de banco (entram com as tabelas, a partir do card 03).
- Playwright (S6).

## Cenários (BDD)
```gherkin
Funcionalidade: Banco testado em toda PR

  Cenário: Migration quebrada bloqueia a PR
    Dado uma PR com uma migration de SQL inválido
    Quando o CI roda
    Então o job "db" falha no "supabase start"

  Cenário: Teste de isolamento quebrado bloqueia a PR
    Dado uma PR que concede "select" a "anon" em "public.probe" dentro do teste de privilégios
    Quando o CI roda
    Então o job "db" falha em "supabase test db"

  Cenário: Banco verde
    Dado uma PR sem mudança de banco
    Quando o CI roda
    Então o job "db" passa e os 9 testes de "0001_default_privileges" aparecem no log

  Cenário: Final de linha não suja a árvore
    Dado um clone no Windows com "core.autocrlf=true"
    Quando eu rodo "git status" sem editar nada
    Então nenhum arquivo aparece como modificado
```

## Critérios de aceite
- [ ] Os 2 cenários de bloqueio comprovados com PRs de rascunho (fechadas sem merge)
- [ ] Job `db` em até 6 minutos com cache
- [ ] Check `db` obrigatório na `main`

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Migration quebrada, teste quebrado | PR de rascunho | `.github/workflows/ci.yml` |
| Banco verde | log do CI, evidência no PR | — |
| Final de linha | comando no Windows, evidência no PR | `.gitattributes` |

## Limites
- Até 5 arquivos. Nenhuma dependência nova.
