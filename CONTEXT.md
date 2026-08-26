# Simulador de Máquina Braille

Este contexto descreve a linguagem do simulador educacional de máquina Braille e das interações que ele reproduz.

## Language

**Simulador de máquina Braille**:
Produto educacional que reproduz digitalmente a interação de uma máquina Braille para aprendizagem e prática.
_Avoid_: Máquina virtual, teclado Braille

**Sessão de digitação**:
Contexto transitório no qual uma pessoa produz e edita um Documento Braille por meio do simulador, independentemente da atividade que iniciou a interação.
_Avoid_: Tela, textarea, modo livre

**Preferências do simulador**:
Escolhas da pessoa que permanecem entre Sessões de digitação, como áudio, visualização preferida, mapeamento de controles e Modo de simulação.
_Avoid_: Estado da sessão, configuração da tela

**Configuração de papel**:
Definição registrada no Documento Braille que estabelece folhas finitas ou Papel contínuo virtual, quantidade de linhas e colunas, margens e, quando aplicável, formato e orientação físicos. As Preferências do simulador guardam somente a configuração inicial de novos documentos.
_Avoid_: Tamanho da tela, preferência global do documento aberto

**Reformatação do papel**:
Alteração confirmada da Configuração de papel que reparte cada linha antiga separadamente na nova grade, preserva todas as Impressões de cela e nunca recombina automaticamente linhas ou folhas existentes.
_Avoid_: Redimensionar a tela, converter texto, cortar conteúdo

**Modo de simulação**:
Preferência que reúne as políticas de comportamento da máquina em um preset Assistido, um preset de Fidelidade física ou uma combinação Personalizada validada.
_Avoid_: Modo livre, modo desafio, configuração sem validação

**Controle da máquina**:
Entrada lógica disponível na máquina, como um ponto Braille, espaço, Retrocesso, Espaçamento de linha ou Retorno do carro, independentemente do dispositivo usado para acioná-la.
_Avoid_: Tecla, tecla física, código de teclado

**Intenção da máquina**:
Solicitação lógica de pressionar, liberar ou cancelar um Controle da máquina, sem identificar o dispositivo que a originou.
_Avoid_: Evento de teclado, gesto, clique

**Cancelamento da entrada**:
Solicitação explícita que descarta os pontos acumulados de um Acorde Braille sem produzir uma Cela Braille.
_Avoid_: Interrupção da captura, confirmar pontos

**Interrupção da captura**:
Término não confirmatório da captura por pausa, perda de foco ou ocultação da página, cuja política decide entre descartar ou confirmar os pontos acumulados.
_Avoid_: Cancelamento da entrada

**Acorde Braille**:
Conjunto de controles de ponto acionados em sobreposição e confirmado quando todos são liberados.
_Avoid_: Atalho, combinação de caracteres

**Composição assistida**:
Forma de produzir uma Cela Braille selecionando pontos individualmente e confirmando o conjunto, sem exigir o acionamento físico simultâneo dos controles.
_Avoid_: Acorde lento, digitação comum

**Ponto Braille**:
Uma das seis posições numeradas que formam a geometria de uma cela Braille.
_Avoid_: Tecla de ponto, ponto físico

**Cela Braille**:
Conjunto imutável dos pontos Braille ativos entre as seis posições, inclusive o conjunto vazio, sem significado textual próprio.
_Avoid_: Letra Braille, caractere Braille

**Impressão de cela**:
Estado explícito de uma posição da Grade Braille que distingue os pontos elevados dos pontos apagados fisicamente; sua Cela Braille contém somente os pontos elevados. Uma impressão sem pontos registra um espaço produzido e se distingue de uma posição nunca utilizada.
_Avoid_: Caractere impresso, estilo visual da cela

**Grade Braille**:
Espaço de linhas e colunas endereçáveis no qual Impressões de cela ocupam posições explícitas, enquanto as demais permanecem nunca utilizadas.
_Avoid_: Matriz de caracteres, textarea

**Sequência Braille**:
Sucessão ordenada das Impressões de cela produzidas em uma linha, incluindo espaços explícitos e excluindo posições nunca utilizadas.
_Avoid_: Texto convertido, cadeia de caracteres

**Folha Braille**:
Grade Braille finita delimitada pela Configuração de papel e usada como uma das folhas ordenadas de um Documento Braille.
_Avoid_: Página da interface, textarea

**Papel contínuo virtual**:
Grade Braille com quantidade finita de colunas e linhas ilimitadas, sem equivalente ao carregamento contínuo na máquina Braille mecânica.
_Avoid_: Folha infinita, rolo da Perkins

**Documento Braille**:
Conteúdo preservado independentemente de qualquer interpretação textual, organizado como uma coleção ordenada de Folhas Braille com a mesma configuração ou como um Papel contínuo virtual.
_Avoid_: Texto convertido, conteúdo do campo de texto

**Posição de edição**:
Coordenada única de linha e coluna do Documento Braille na qual a próxima Operação da máquina atua, esteja a posição vazia ou ocupada.
_Avoid_: Cursor do textarea, seleção do DOM

**Posição de revisão**:
Coordenada de linha e coluna do Documento Braille que a pessoa examina sem alterar a Posição de edição ou o conteúdo revisado.
_Avoid_: Posição de edição, foco do navegador

**Navegação assistida**:
Política opcional e ativa por padrão que permite mover a Posição de revisão em quatro direções sem modificar a Posição de edição ou o Documento Braille.
_Avoid_: Retrocesso, movimento físico do papel

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
Resultado semântico produzido pela interação com os controles da máquina, como confirmar uma cela, inserir espaço, realizar um Retrocesso, espaçar uma linha ou retornar o carro.
_Avoid_: Evento de teclado, callback

**Espaçamento de linha**:
Operação que avança uma linha na Grade Braille e preserva a coluna atual da Posição de edição.
_Avoid_: Enter, nova linha

**Retorno do carro**:
Operação que move a Posição de edição para a primeira coluna da linha atual sem modificar Impressões de cela.
_Avoid_: Retrocesso, início de parágrafo

**Apagamento físico**:
Operação de correção que achata pontos elevados sem remover da Impressão de cela os vestígios dos pontos apagados.
_Avoid_: Excluir cela, limpar caractere

**Comando da sessão**:
Solicitação que altera a interação da Sessão de digitação, como a captura de acordes, a posição de edição ou o modo de visualização, sem simular um Controle da máquina.
_Avoid_: Tecla de atalho, ação da máquina

**Ação da atividade**:
Solicitação pertencente à atividade educacional que usa a Sessão de digitação, como confirmar uma resposta, repetir uma palavra ou ouvir instruções.
_Avoid_: Controle da máquina, comando da sessão

**Retrocesso**:
Operação que desloca a Posição de edição uma coluna para trás; conforme o Modo de simulação, preserva a impressão anterior, exclui-a deixando a posição livre ou exclui-a compactando o restante da linha.
_Avoid_: Apagar, backspace
