# Simulador de Máquina Braille

Este contexto descreve a linguagem do simulador educacional de máquina Braille e das interações que ele reproduz.

## Language

**Simulador de máquina Braille**:
Produto educacional que reproduz digitalmente a interação de uma máquina Braille para aprendizagem e prática.
_Avoid_: Máquina virtual, teclado Braille

**Controle da máquina**:
Entrada lógica disponível na máquina, como um ponto Braille, espaço, retrocesso ou mudança de linha, independentemente do dispositivo usado para acioná-la.
_Avoid_: Tecla, tecla física, código de teclado

**Acorde Braille**:
Conjunto de controles de ponto acionados em sobreposição e confirmado quando todos são liberados.
_Avoid_: Atalho, combinação de caracteres

**Ponto Braille**:
Uma das seis posições numeradas que formam a geometria de uma cela Braille.
_Avoid_: Tecla de ponto, ponto físico

**Cela Braille**:
Conjunto imutável dos pontos Braille ativos entre as seis posições, inclusive o conjunto vazio, sem significado textual próprio.
_Avoid_: Letra Braille, caractere Braille

**Sequência Braille**:
Sucessão ordenada de celas Braille em uma única linha, incluindo celas vazias, que preserva exatamente o conteúdo produzido pela pessoa.
_Avoid_: Texto convertido, cadeia de caracteres

**Documento Braille**:
Conteúdo formado por uma ou mais sequências Braille separadas por mudanças de linha estruturais, preservado independentemente de qualquer interpretação textual.
_Avoid_: Texto convertido, conteúdo do campo de texto

**Sinal Braille**:
Uma ou mais celas Braille reconhecidas em conjunto por uma grafia Braille.
_Avoid_: Caractere Braille

**Indicador Braille**:
Sinal Braille que modifica a interpretação dos sinais seguintes, como os indicadores de número ou de letra maiúscula.
_Avoid_: Prefixo, caractere de controle

**Símbolo textual**:
Resultado semântico da interpretação de um sinal Braille em seu contexto, como uma letra, um algarismo ou uma marca de pontuação.
_Avoid_: Caractere correspondente

**Interpretação Braille**:
Leitura derivada de um documento Braille segundo um perfil de grafia, formada por segmentos relacionados às celas que lhes deram origem e sem substituir o documento interpretado.
_Avoid_: Texto convertido, resultado da conversão

**Segmento de interpretação**:
Trecho da interpretação Braille que relaciona um intervalo de celas ao sinal reconhecido, ao seu papel e ao significado resultante, ou registra que o trecho está pendente, não reconhecido ou ambíguo.
_Avoid_: Caractere convertido, token

**Grafia Braille**:
Conjunto de sinais e regras contextuais que permite interpretar uma sequência de celas Braille sem definir sua apresentação visual ou sonora.
_Avoid_: Tabela de conversão, alfabeto Braille

**Perfil de grafia**:
Identificação explícita de uma grafia Braille e de sua edição normativa, fornecida à interpretação sem fazer parte das celas interpretadas.
_Avoid_: Idioma, conversor

**Operação da máquina**:
Resultado semântico produzido pela interação com os controles da máquina, como confirmar uma cela, inserir espaço, realizar um retrocesso ou mudar de linha.
_Avoid_: Evento de teclado, callback

**Retrocesso**:
Operação que desloca a posição da máquina uma cela para trás; no simulador, pode resultar na exclusão da cela anterior por conveniência de uso.
_Avoid_: Apagar, backspace
