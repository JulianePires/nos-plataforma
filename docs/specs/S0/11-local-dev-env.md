# NOS-11 · Supabase local em Docker como ambiente de dev

**Sprint:** S0 (fechamento) · **Estimativa:** 1 h · **Branch:** `chore/s0-local-dev-env`

## Objetivo
O ambiente de dev é só o Supabase local em Docker, o Preview da Vercel usa as chaves públicas do `nos-prod`, e nada no repo trata o `nos-dev` hospedado como ambiente atual.

## Contexto (o Claude lê só isto)
- `.mcp.json`, `.env.example`
- `docs/adr/0004-vercel-environments.md`, `docs/specs/S0/04-supabase.md`, `docs/specs/S0/05-vercel.md`, `docs/prompts/S0-sessoes.md`, `docs/specs/backlog.md`

## Referências (context7)
- vercel (environment variables por ambiente)

## Requisitos
- Origem: backlog, item do NOS-9. O plano gratuito do Supabase não comporta `nos-dev` e `nos-prod`. O dev passa a ser o `supabase start`.
- Vercel (feito por você): Preview e Development com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` do `nos-prod`, e nenhuma outra chave do Supabase.
- O fail-fast do env no boot não muda: vale em todos os ambientes.
- MCP do Supabase aponta para o `nos-prod` em `read_only`: a variável do project ref vira `SUPABASE_PROD_PROJECT_REF` no `.mcp.json`, no `.env.example` e na instalação do kit (`docs/prompts/00-prompt-inicial.md`). Você atualiza o seu `.env.local`.
- ADR 0009 novo (Supabase local como dev, Preview no `nos-prod`). ADR 0004 atualizado: deixa de proibir valor de produção em Preview, mantém a proibição de chave privilegiada.
- Specs 04 e 05 e `docs/prompts/S0-sessoes.md` sem `nos-dev` como ambiente atual. Nas specs fechadas, o texto antigo ganha uma nota apontando para o NOS-11, sem reescrever o histórico.
- `docs/prompts/S0-sessoes.md`: card 11 entra na sessão 4 com a ordem 09 → 11 → 10 → 07 → 08, e o checklist de fechamento passa a cobrir os cards 01 a 11 e só o `nos-prod`.
- Item do backlog sai da tabela (resolvido aqui).

## Fora de escopo
- Banco de preview isolado (Supabase Branching): exige plano pago.
- Apagar o projeto `nos-dev` no Supabase e mexer nas variáveis da Vercel: feito por você, fora do repo.
- Publishable key no lugar da anon key (S2).

## Cenários (BDD)
```gherkin
Funcionalidade: Preview no banco de produção

  Cenário: Preview usa as chaves públicas de produção
    Dado o preview do PR deste card
    Então NEXT_PUBLIC_SUPABASE_URL aponta para o projeto nos-prod
    E a página inicial responde 200
    E nenhuma chave do Supabase além da URL e da anon key existe em Preview
```

## Critérios de aceite
- [ ] Preview do PR deste card responde 200 (evidência: URL no PR)
- [ ] Variáveis de Preview e Development na Vercel conferidas: só URL e anon key do `nos-prod`
- [ ] Nenhum doc trata o `nos-dev` como ambiente atual; menções a ele são histórico ou nota do NOS-11
- [ ] ADR 0009 com status Aceita; ADR 0004 atualizado
- [ ] MCP do Supabase conectado ao `nos-prod` em `read_only` depois de você atualizar o `.env.local`

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Preview usa as chaves públicas de produção | manual (Vercel), evidência no PR | — |
| Docs sem `nos-dev` atual | script (`rg -n "nos-dev"` revisado à mão) | — |

## Limites
- Até 20 arquivos. Sem dependência nova. Sem mudança de código.
