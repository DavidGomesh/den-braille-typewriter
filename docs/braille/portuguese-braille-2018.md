# Perfil português Braille de 2018

## Identificação e fonte

O perfil técnico `portuguese-braille-2018` representa o recorte atualmente
implementado da **Grafia Braille para a Língua Portuguesa**, 3ª edição, publicada
pelo Ministério da Educação em 2018. A fonte normativa está versionada em
[`docs/Grafia Braille para a Língua Portuguesa.pdf`](../Grafia%20Braille%20para%20a%20Língua%20Portuguesa.pdf).

Este perfil é selecionado explicitamente:

```ts
const profile = createOrthographyProfile('portuguese-braille-2018')
const interpretation = interpretBrailleDocument(document, profile)
```

O nome não significa que toda a publicação normativa já esteja implementada.
Ele identifica a norma usada pelas regras disponíveis. Sinais ainda não
cobertos permanecem `unrecognized`, em vez de receberem equivalências do código
legado ou de outra grafia.

## Notação deste documento

Uma cela é escrita pela lista dos pontos elevados entre parênteses. Assim,
`(1)` é a letra `a`, `(12)` é `b`, `(46)` é o indicador de maiúscula e `()` é
uma Impressão de cela vazia, isto é, um espaço explícito.

## Letras atualmente reconhecidas

| Letras | Pontos |
| --- | --- |
| a, b, c, d, e | (1), (12), (14), (145), (15) |
| f, g, h, i, j | (124), (1245), (125), (24), (245) |
| k, l, m, n, o | (13), (123), (134), (1345), (135) |
| p, q, r, s, t | (1234), (12345), (1235), (234), (2345) |
| u, v, w, x, y, z | (136), (1236), (2456), (1346), (13456), (1356) |
| ç, á, à, â, ã | (12346), (12356), (1246), (16), (345) |
| é, ê, í, ó, ô, õ, ú | (123456), (126), (34), (346), (1456), (246), (23456) |

As letras são minúsculas por padrão. O perfil não infere maiúsculas pela
posição na frase.

## Indicadores de maiúscula

### Uma letra

O indicador `(46)` seguido imediatamente por uma letra forma uma letra
maiúscula.

```text
(46) (1)  → A
```

O resultado preserva dois segmentos: o indicador `capital-letter` e o símbolo
`A`. A origem de `A` inclui as duas celas. Sem uma letra adjacente, o indicador
fica `pending`.

### Uma palavra

Dois indicadores adjacentes `(46) (46)` aplicam caixa alta às letras seguintes,
até o primeiro sinal que não seja uma letra reconhecida.

```text
(46) (46) (12) (14)  → BC
```

O par continua visível como indicador `capital-word`; cada letra resultante
referencia o par e sua própria cela.

O indicador de série de palavras em caixa alta `(25) (46) (46)` ainda não faz
parte do recorte implementado.

## Números

O indicador `(3456)` transforma as letras `a` a `j` imediatamente seguintes nos
algarismos `1` a `0`.

| Algarismos | Pontos após o indicador |
| --- | --- |
| 1, 2, 3, 4, 5 | (1), (12), (14), (145), (15) |
| 6, 7, 8, 9, 0 | (124), (1245), (125), (24), (245) |

```text
(3456) (12) (245)  → 20
```

O número é um único segmento textual cuja origem inclui o indicador e todos os
algarismos. O indicador também permanece como segmento `number`. Sem algarismo
adjacente, ele fica `pending`.

### Separador decimal

A cela `(2)` entre algarismos de uma sequência numérica produz vírgula decimal:

```text
(3456) (145) (2) (15)  → 4,5
```

Somente uma vírgula decimal é consumida por número.

### Separador de classes

A cela `(3)` na parte inteira separa classes de exatamente três algarismos:

```text
(3456) (1) (245) (3) (245) (245) (245)  → 10 000
```

O grupo inicial pode ter de um a três algarismos; cada grupo posterior precisa
ter três. O separador não é aceito depois da vírgula decimal. Uma estrutura
inválida encerra o número antes da cela `(3)`, que volta a ser observada como
ambígua.

## Espaço, pontuação e diagnósticos

| Entrada | Resultado atual |
| --- | --- |
| () | espaço explícito (`" "`) |
| (2) | vírgula, fora de um número |
| (23) | ponto e vírgula |
| (25) | dois-pontos |
| (26) | ponto de interrogação |
| (235) | ponto de exclamação |
| (36) | hífen |
| (3) | `ambiguous`, com as alternativas ponto e apóstrofo |
| qualquer cela não coberta | `unrecognized` |

A ambiguidade de `(3)` fora do contexto numérico é deliberada: a norma atribui
à cela funções de ponto e apóstrofo, e o recorte atual não aplica análise
linguística suficiente para escolher uma delas.

## Limites atuais

Ainda não estão implementados, entre outros:

- série de palavras em caixa alta e regras completas para siglas;
- números ordinais, frações, numeração romana e articulação entre letras e
  números;
- sinais de ênfase, translineação, transpaginação e notas de transcrição;
- conjunto completo de pontuação, símbolos acessórios, matemáticos e grafias
  especializadas;
- desambiguação linguística de ponto e apóstrofo.

Essas ausências são parte do resultado observável: o algoritmo não substitui um
sinal desconhecido por caractere aproximado. Cada ampliação deve citar a seção
normativa correspondente, acrescentar exemplos públicos e preservar a
rastreabilidade das celas.

## Relação com o algoritmo

A ordem de decisões, a formação das linhas e as regras de rastreabilidade estão
documentadas em
[`src/braille/orthography/README.md`](../../src/braille/orthography/README.md).

