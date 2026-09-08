# Capacidade Braille

## Responsabilidade

Esta capacidade concentra regras Braille independentes de experiência,
dispositivo e apresentação. Neste primeiro corte, `machine` implementa o Motor da
máquina Braille: recebe Intenções da máquina e produz estado, snapshot e eventos
semânticos por uma transição pura.

Não pertencem ao Motor: interpretação textual, Documento Braille, Sessão de
digitação, origem física dos controles, React, DOM, áudio ou qualquer efeito
colateral.

## Interface pública

Consumidores e testes importam somente `braille/public.ts`. A interface oferece:

- `criarPontoBraille` e `criarCelaBraille` para valores validados, canônicos e
  imutáveis;
- `criarEstadoMotor` para iniciar uma captura sem controles ativos;
- `aplicarIntencao` como única transição do Motor;
- os tipos das intenções, operações, eventos, estado, snapshot e resultado.

Exemplo:

```ts
import { aplicarIntencao, criarEstadoMotor, criarPontoBraille } from './public'

const pressionou = aplicarIntencao(criarEstadoMotor(), {
    tipo: 'pressionar',
    controle: { tipo: 'ponto', ponto: criarPontoBraille(1) },
})

const confirmou = aplicarIntencao(pressionou.estado, {
    tipo: 'liberar',
    controle: { tipo: 'ponto', ponto: criarPontoBraille(1) },
})
```

## Invariantes e ordem

- Um Ponto Braille é uma posição inteira de 1 a 6.
- Uma Cela Braille contém pontos distintos e ordenados; a cela vazia é válida.
- Um acorde acumula pontos distintos desde a primeira pressão e confirma uma
  única cela somente quando todos os pontos são liberados.
- Espaço, Retrocesso, Espaçamento de linha e Retorno do carro produzem uma
  operação somente após um ciclo válido de pressão e liberação.
- Repetir uma pressão ou liberar um controle inativo preserva o estado e produz
  `entrada-rejeitada`.
- `cancelar-entrada` sempre descarta os pontos acumulados sem produzir operação.
- `interromper-captura` encerra todos os controles ativos e confirma ou descarta
  o acorde conforme a política recebida.

Os construtores rejeitam posições inválidas com `RangeError`. A transição não
lança para uma sequência inesperada de intenções: ela devolve um diagnóstico
semântico. Estado, snapshot, eventos e valores são serializáveis e não devem ser
alterados pelo consumidor.

## Dependências e adapters

O Motor usa somente TypeScript e não depende de outras capacidades do produto.
Adapters de dispositivo não pertencem a `braille`; futuramente, a Sessão de
digitação receberá intenções normalizadas de seus próprios adapters e as enviará
ao Motor.

## Estratégia de testes

Os exemplos e invariantes são exercitados em `machine.test.ts` exclusivamente
por `braille/public.ts`. Os testes observam resultados da transição e não acessam
arquivos internos nem efeitos de plataforma.

## Referências

- `CONTEXT.md`
- `docs/adr/0001-motor-braille-como-transicao-pura.md`
- `docs/adr/0007-testes-por-interfaces-e-guardrails-continuos.md`
- `docs/adr/0011-arquitetura-por-capacidades-e-interfaces-publicas.md`
- `docs/architecture/modules.md`
- `docs/architecture/runtime-flows.md`
