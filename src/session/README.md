# Capacidade de Sessão de digitação

## Responsabilidade

A capacidade `session` coordena captura intencional, Motor, Documento Braille,
Configuração efetiva da sessão e interpretação observável. Seu núcleo é puro:
recebe `SessionInput`, devolve novo estado, snapshot e fatos semânticos e não
depende de React, DOM, áudio ou dispositivo.

O Documento Braille contido em `TypingSessionState` é a única fonte de verdade
da produção. A Interpretação Braille existe somente como projeção derivada em
`TypingSessionSnapshot`.

## Interface pública

Consumidores e testes importam somente `session/public.ts`. A interface oferece:

- `createTypingSession` para criar documento, motor e captura inativa;
- `applySessionInput` como única transição da Sessão de digitação;
- `getTypingSessionSnapshot` para derivar o estado observável sem alterá-lo;
- `mapWebKeyboardEvent` como adapter específico do teclado web;
- tipos de estado, configuração, entrada, evento, resultado e snapshot.

Exemplo:

```ts
import {
    createOrthographyProfile,
    createPaperConfiguration,
} from '../braille/public'
import { applySessionInput, createTypingSession } from './public'

let session = createTypingSession({
    paper: createPaperConfiguration({ type: 'continuous', columns: 40 }),
    profile: createOrthographyProfile('portuguese-braille-2018'),
    effectiveConfiguration: { interruptionPolicy: 'discard' },
})

session = applySessionInput(session, {
    type: 'activate-capture',
}).state

session = applySessionInput(session, {
    type: 'machine-intent',
    source: 'web-keyboard',
    intent: {
        type: 'press',
        control: { type: 'dot', dot: 1 },
    },
}).state
```

## Captura e interrupção

- A captura começa inativa e uma Intenção da máquina fora dela produz
  `session-input-rejected` sem alterar estado.
- O primeiro adapter que inicia um acorde torna-se responsável por ele. A posse
  termina quando o Motor volta ao repouso, permitindo que outra fonte inicie o
  acorde seguinte sem disputar controles ainda pressionados.
- A UI controla a região focável e informa perda de foco, pausa ou ocultação da
  página por `interrupt-capture`.
- A interrupção usa `interruptionPolicy` da Configuração efetiva para confirmar
  ou descartar o acorde incompleto, encerra controles ativos e desativa captura.
- `move-review` altera somente a Posição de revisão e permanece independente da
  captura, da Posição de edição e do conteúdo.
- Eventos do Motor continuam observáveis como fatos da sessão. Operações
  produzidas são aplicadas ao Documento Braille antes da criação do snapshot.

## Adapter web de teclado

`mapWebKeyboardEvent` recebe somente os campos de teclado de que necessita e
devolve Intenções da máquina, o Controle lógico para apresentação visual ou um
Comando da sessão. A UI decide onde instalar os handlers e chama `preventDefault`
apenas quando `handled` é verdadeiro.

| Código físico | Controle lógico                                  |
| ------------- | ------------------------------------------------ |
| `F`, `D`, `S` | Pontos 1, 2 e 3                                  |
| `J`, `K`, `L` | Pontos 4, 5 e 6                                  |
| `Space`       | Espaço                                           |
| `Backspace`   | Retrocesso                                       |
| `Q`           | Espaçamento de linha seguido de Retorno do carro |
| Setas         | Movimento da Posição de revisão                  |
| `Escape`      | Pausa ou retomada da captura                     |

Teclas modificadas e não mapeadas permanecem disponíveis ao navegador. A
repetição automática é consumida sem repetir a Intenção da máquina.

## Integração temporária do Modo livre

`views/modes/Free.tsx` compõe a sessão, o feedback legado e a apresentação.
`ui/session/FreeTypingSession.tsx` recebe somente o snapshot e callbacks:
controla foco e estado visual efêmero, projeta o snapshot no `textarea` somente
leitura e usa o teclado visual existente. A lista legada de celas não participa
do Modo livre; o Modo desafio continua no caminho anterior até seu corte
próprio.

As setas enviam `move-review` diretamente à sessão; não fingem ser Controles da
máquina. O estado acessível informa captura e Posição de revisão.

## Estratégia de testes

- `session.test.ts` exerce criação, captura, fonte responsável, políticas de
  interrupção e atualização do documento pela interface pública;
- `adapters/web/keyboard/keyboard.test.ts` verifica o contrato do adapter;
- `tests/journeys/free-mode.test.tsx` cobre foco, teclado, controles essenciais,
  interrupção e projeção no Modo livre pelo DOM acessível.

## Referências

- `CONTEXT.md`
- `docs/adr/0001-motor-braille-como-transicao-pura.md`
- `docs/adr/0003-sessao-de-digitacao-como-coordenadora-pura.md`
- `docs/adr/0006-acessibilidade-como-contrato-arquitetural.md`
- `docs/adr/0007-testes-por-interfaces-e-guardrails-continuos.md`
- `docs/architecture/runtime-flows.md`
- `docs/architecture/migration-plan.md`
