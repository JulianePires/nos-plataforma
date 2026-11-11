# NOS-1 (parte 2) · Vercel com preview por PR

**Sprint:** S0 · **Estimativa:** 0,5 h · **Branch:** `chore/s0-vercel`

## Objetivo
Push na `main` publica em produção, e toda PR ganha uma URL de preview.

> Atualização (NOS-11, ADR 0009): o `nos-dev` hospedado saiu. Preview e Development usam a URL e a anon key do `nos-prod`; o cenário "Preview usa o banco de dev" e o critério "Nenhuma variável de produção exposta em Preview" deixaram de valer (Preview recebe só as chaves públicas do `nos-prod`).

## Contexto
- `apps/web/package.json`, `turbo.json`, `.env.example`

## Referências (context7)
- vercel (monorepo turborepo, root directory, environment variables)

## Requisitos
- Projeto Vercel conectado ao repo com Root Directory `apps/web` (via painel ou MCP vercel; confirme comigo antes de criar).
- Variáveis: Preview e Development usam `nos-dev`; Production usa `nos-prod`.
- `vercel.json` só se for necessário. Se não for, não crie.

## Fora de escopo
- Domínio próprio e plano Pro (S6).

## Cenários (BDD)
```gherkin
Funcionalidade: Deploy contínuo

  Cenário: Preview por PR
    Dado uma PR aberta
    Quando o build da Vercel termina
    Então a PR recebe um comentário com a URL de preview
    E a página inicial responde 200

  Cenário: Preview usa o banco de dev
    Dado o preview de uma PR
    Então NEXT_PUBLIC_SUPABASE_URL aponta para o projeto nos-dev
```

## Critérios de aceite
- [x] URL de preview no PR deste card
- [x] Nenhuma variável de produção exposta em Preview

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| Preview e banco de dev | manual, evidência no PR | — |

## Limites
- Até 5 arquivos. Nenhuma dependência.
