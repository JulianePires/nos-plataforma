# <ID> · <título do card>

**Sprint:** <Sx> · **Estimativa:** <h> · **Branch:** `<type>/<sx>-<slug>`

## Objetivo
<uma frase: o que existe depois que o card fecha>

## Contexto (o Claude lê só isto)
- <arquivos do repo>

## Referências (context7)
- <libs>

## Requisitos
- <comportamento esperado, sem implementação>

## Fora de escopo
- <o que NÃO fazer neste card>

## Cenários (BDD)
```gherkin
Funcionalidade: <nome>

  Cenário: <caminho feliz>
    Dado <estado>
    Quando <ação>
    Então <resultado observável>
```

## Critérios de aceite
- [ ] <verificável>

## Plano de testes (TDD)
| Cenário | Tipo | Arquivo |
| --- | --- | --- |
| <cenário> | unit/e2e/pgTAP/script | <caminho> |

## Limites
- Até 20 arquivos. Sem dependência nova fora das listadas.
