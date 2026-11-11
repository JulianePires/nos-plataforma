# Prompt inicial (cole na primeira sessão)

Use uma vez, depois de copiar o kit para o repo. Ele calibra o Claude Code: confirma as regras, testa os MCPs e mostra se entendeu o fluxo, antes de qualquer código.

```text
Você vai trabalhar comigo na Nós Plataforma. Antes de qualquer código:

1. Leia @CLAUDE.md e @docs/context/INDEX.md. Não abra mais nada.
2. Me devolva, em até 12 linhas, as regras que você vai seguir em todo card:
   fluxo (spec → perguntas → plano → BDD/TDD → /review → /pr), limite de 20 arquivos,
   comentários, reuso sem duplicação, padrões de projeto sem overengineering, ADRs,
   UI sem serifa, RLS com pgTAP, idioma (conversa em PT, código em EN).
3. Teste os MCPs com uma chamada leve cada e diga ok/falhou:
   - context7: resolva a lib "next.js"
   - supabase: liste as tabelas do projeto (read-only)
   - github: leia o nome do repo atual
   - vercel e figma: só confirme que conectaram
4. Aponte qualquer regra do CLAUDE.md que esteja ambígua ou que conflite com outra. Não corrija sozinho, me pergunte.

Regras permanentes desta parceria:
- Sempre pergunte quando faltar informação que muda a implementação. Não preencha lacunas com suposição.
- Sempre consulte uma referência (context7 ou doc oficial) antes de escolher entre duas abordagens, e cite a fonte em uma linha.
- Sempre rode /review e espere eu ver o diff antes de dizer que terminou.
- Sempre termine uma entrega com a sugestão de commit, título e descrição de PR (/pr).
- Seja breve. Não repita a spec, o diff ou o que eu acabei de dizer.
```

## Higiene de contexto (economia de token)

- **`/clear` entre cards.** Cada card começa do zero, lendo só a spec.
- **`/compact` no meio de um card longo**, com foco: `/compact mantenha o plano aprovado e os testes que faltam`.
- **Plan mode** (Shift+Tab) para o `/card`: o Claude não escreve nada até você aprovar.
- **Subagente `reviewer`** faz a leitura pesada do diff fora do contexto principal.
- **context7 em vez de memória**: docs atualizadas e só o trecho necessário. Peça "use context7" quando ele hesitar sobre a API de uma lib.
- **Arquivos por menção** (`@caminho`) em vez de "procure onde está X".
- **Modelo:** use o mais forte no `/card` e no `/review` (decisões), e um mais rápido no `/tdd` de cards mecânicos, se quiser economizar.

## Instalação do kit

1. Copie a pasta inteira para a raiz do repo `nos-plataforma`.
2. `chmod +x scripts/check-pr-size.sh`
3. Crie `.env.local` com `SUPABASE_PROD_PROJECT_REF` (ref do `nos-prod`; o MCP roda em `read_only`, ADR 0009) e `GITHUB_PAT` (PAT fine-grained, só este repo). Exporte as duas no terminal antes de abrir o `claude`.
4. Abra `claude` na raiz, aprove os servidores do `.mcp.json` e rode `/mcp` para autenticar supabase, vercel e figma pelo navegador.
5. Cole o prompt inicial acima.
