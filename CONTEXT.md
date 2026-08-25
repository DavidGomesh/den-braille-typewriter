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

**Cela Braille**:
Padrão de até seis pontos Braille produzido por um acorde, sem associação obrigatória a um caractere específico.
_Avoid_: Letra Braille, caractere Braille

**Operação da máquina**:
Resultado semântico produzido pela interação com os controles da máquina, como confirmar uma cela, inserir espaço, realizar um retrocesso ou mudar de linha.
_Avoid_: Evento de teclado, callback

**Retrocesso**:
Operação que desloca a posição da máquina uma cela para trás; no simulador, pode resultar na exclusão da cela anterior por conveniência de uso.
_Avoid_: Apagar, backspace
