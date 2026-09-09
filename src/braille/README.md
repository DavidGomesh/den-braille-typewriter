# Capacidade Braille

## Responsabilidade

Esta capacidade concentra regras Braille independentes de experiência,
dispositivo e apresentação. O módulo `machine` implementa o Motor da máquina
Braille: recebe `MachineIntent` (Intenção da máquina) e produz estado, snapshot e
eventos semânticos por uma transição pura. O módulo `document` mantém o
`BrailleDocument` (Documento Braille), suas grades, configuração de papel,
posições e `CellImpression` (Impressão de cela), sem atribuir texto às celas.

Não pertencem ao Motor: interpretação textual, Documento Braille, Sessão de
digitação, origem física dos controles, React, DOM, áudio ou qualquer efeito
colateral.

## Interface pública

Consumidores e testes importam somente `braille/public.ts`. A interface oferece:

- `createBrailleDot` e `createBrailleCell` para criar Ponto Braille e Cela
  Braille validados, canônicos e imutáveis;
- `createEngineState` para iniciar uma captura sem controles ativos;
- `applyIntent` como única transição do Motor;
- os tipos das intenções, operações, eventos, estado, snapshot e resultado.
- `createCellImpression` para distinguir pontos elevados, vestígios de pontos
  apagados e espaço explícito;
- `createGridPosition`, `createBrailleGrid`, `recordCellImpression` e
  `getCellImpression` para registrar e consultar a produção por posição.
- `createPaperConfiguration` e `createBrailleDocument` para iniciar Folhas
  Braille finitas ou Papel contínuo virtual;
- `applyDocumentOperation`, `eraseCellDots` e `moveReviewPosition` para editar e
  revisar o documento preservando as distinções mecânicas;
- `prepareBrailleDocumentReformat` e `confirmBrailleDocumentReformat` para
  confirmar uma nova configuração e repartir as linhas sem perder impressões.
- `createOrthographyProfile` para selecionar explicitamente a Grafia Braille
  para a Língua Portuguesa, 3ª edição (2018);
- `interpretBrailleDocument` para derivar linhas e Segmentos de interpretação
  rastreáveis sem alterar o Documento Braille.

Exemplo:

```ts
import { applyIntent, createBrailleDot, createEngineState } from './public'

const pressed = applyIntent(createEngineState(), {
    type: 'press',
    control: { type: 'dot', dot: createBrailleDot(1) },
})

const confirmed = applyIntent(pressed.state, {
    type: 'release',
    control: { type: 'dot', dot: createBrailleDot(1) },
})
```

## Invariantes e ordem

- `BrailleDot` representa um Ponto Braille com posição inteira de 1 a 6.
- `BrailleCell` representa uma Cela Braille com pontos distintos e ordenados; a
  cela vazia é válida.
- Um acorde acumula pontos distintos desde a primeira pressão e confirma uma
  única cela somente quando todos os pontos são liberados.
- Espaço, Retrocesso, Espaçamento de linha e Retorno do carro produzem uma
  operação somente após um ciclo válido de pressão e liberação.
- Repetir uma pressão ou liberar um controle inativo preserva o estado e produz
  `input-rejected`.
- `cancel-input` sempre descarta os pontos acumulados sem produzir operação.
- `interrupt-capture` encerra todos os controles ativos e confirma ou descarta o
  acorde conforme a `policy` recebida.

Os construtores rejeitam posições inválidas com `RangeError`. A transição não
lança para uma sequência inesperada de intenções: ela devolve um diagnóstico
semântico em inglês, destinado ao consumo técnico e não à apresentação direta.
Estado, snapshot, eventos e valores são serializáveis e não devem ser alterados
pelo consumidor.

## Documento Braille

- `GridPosition` usa linhas e colunas inteiras, zero-based e não negativas.
- Uma posição ausente em `BrailleGrid` nunca foi utilizada.
- Uma `CellImpression` vazia ocupa uma posição e registra um espaço explícito.
- `erasedDots` preserva vestígios físicos separadamente dos pontos elevados em
  `cell`; o mesmo ponto não pode ocupar os dois estados.
- `recordCellImpression` é a operação primitiva imutável da Grade e rejeita uma
  posição já utilizada com `position-already-used`.
- A grade contém somente geometria Braille. Texto, caracteres e significado
  pertencem à Interpretação Braille e não fazem parte desta interface.
- `PaperConfiguration` valida linhas, colunas e margens e distingue folhas
  finitas de papel contínuo com linhas ilimitadas.
- `editingPosition` e `reviewPosition` evoluem independentemente. Navegar para
  revisão não altera conteúdo nem o próximo local de edição.
- Espaço registra uma Impressão de cela vazia; Retrocesso só desloca a Posição
  de edição; Espaçamento de linha preserva a coluna; Retorno do carro volta à
  margem esquerda.
- Apagamento físico move pontos elevados para `erasedDots`; gravá-los novamente
  torna-os elevados sem apagar os demais vestígios.
- Reformatação exige preparação e confirmação explícitas. Cada linha antiga é
  repartida isoladamente e linhas vazias internas permanecem separadas, sem
  recombinar nem perder Impressões de cela.

Coordenadas inválidas e sobreposição entre ponto elevado e apagado produzem
`RangeError`. Tentativas válidas que conflitam com o estado do documento devolvem
um `GridResult` (Resultado da Grade) com erro estruturado e preservam o estado
anterior.

## Grafia e interpretação

A visão detalhada do algoritmo, seus fluxos e regras de extensão está em
[`orthography/README.md`](orthography/README.md). O recorte normativo do perfil
português atual está em
[`docs/braille/portuguese-braille-2018.md`](../../docs/braille/portuguese-braille-2018.md).

- `OrthographyProfile` identifica a grafia e a edição normativa; perfis
  desconhecidos são rejeitados, sem inferência silenciosa por idioma.
- `BrailleInterpretation` é uma projeção imutável do Documento Braille. Cada
  linha contém segmentos cujas posições em `source` apontam para as Impressões
  de cela de origem.
- Segmentos com `role: 'indicator'` permanecem explícitos mesmo quando não
  produzem texto isoladamente. O símbolo resultante referencia também as celas
  do indicador que lhe deram contexto.
- Os indicadores de letra maiúscula, palavra em caixa alta e número são
  resolvidos como sequências adjacentes. Dentro de um número, as celas de
  vírgula decimal e de separação de classes são interpretadas pelo contexto
  numérico; uma posição nunca utilizada interrompe o sinal.
- Um indicador sem o sinal esperado produz `pending`; um sinal com mais de uma
  leitura disponível produz `ambiguous`; conteúdo ainda não coberto pelo perfil
  produz `unrecognized`. Nenhum desses estados inventa um Símbolo textual.
- As tabelas e o estado contextual ficam internos ao módulo. Consumidores
  escolhem o perfil e recebem a interpretação estruturada, sem controlar suas
  regras.

## Dependências e adapters

O Motor usa somente TypeScript e não depende de outras capacidades do produto.
Adapters de dispositivo não pertencem a `braille`; futuramente, a Sessão de
digitação receberá intenções normalizadas de seus próprios adapters e as enviará
ao Motor. A camada de apresentação será responsável por transformar eventos em
texto localizado quando houver comunicação com a pessoa usuária.

## Estratégia de testes

Os exemplos e invariantes são exercitados em `machine.test.ts`,
`document.test.ts` e `orthography.test.ts` exclusivamente por
`braille/public.ts`. Os testes observam resultados públicos e não acessam
arquivos internos nem efeitos de plataforma. Código e descrições dos testes usam
inglês; este documento permanece em português.

## Referências

- `CONTEXT.md`
- `docs/adr/0001-motor-braille-como-transicao-pura.md`
- `docs/adr/0002-documento-braille-e-grafia-contextual.md`
- `docs/adr/0007-testes-por-interfaces-e-guardrails-continuos.md`
- `docs/adr/0011-arquitetura-por-capacidades-e-interfaces-publicas.md`
- `docs/adr/0013-ingles-nos-contratos-tecnicos.md`
- `docs/architecture/modules.md`
- `docs/architecture/runtime-flows.md`
- `docs/Grafia Braille para a Língua Portuguesa.pdf`
