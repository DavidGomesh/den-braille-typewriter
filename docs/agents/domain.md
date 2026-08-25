# Domain docs

Estas regras definem como as skills de engenharia devem consultar a documentação de domínio antes de explorar ou alterar o código.

## Antes de explorar

Leia, quando existirem:

- `CONTEXT.md` na raiz do repositório;
- `CONTEXT-MAP.md`, caso venha a existir, e os arquivos de contexto relevantes indicados por ele;
- as ADRs em `docs/adr/` relacionadas à área que será modificada.

Se algum desses arquivos não existir, prossiga silenciosamente. A skill `domain-modeling` poderá criá-lo quando termos ou decisões forem efetivamente definidos.

## Estrutura

Este é um repositório single-context:

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

O `CONTEXT.md` e o conteúdo das ADRs devem ser escritos em português. Nomes de arquivos, identificadores técnicos e títulos estruturais podem permanecer em inglês.

## Vocabulário do domínio

Ao nomear conceitos do domínio em issues, propostas, hipóteses ou testes, use os termos definidos no `CONTEXT.md`. Não substitua esses termos por sinônimos que o glossário desaconselhe.

Quando um conceito necessário ainda não estiver no glossário, verifique se ele representa uma lacuna real antes de introduzir um novo termo.

## Conflitos com ADRs

Se uma proposta contrariar uma ADR existente, indique o conflito explicitamente em português, em vez de substituir silenciosamente a decisão anterior.
