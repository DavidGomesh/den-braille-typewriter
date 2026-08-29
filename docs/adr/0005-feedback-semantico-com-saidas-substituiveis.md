# Feedback semântico com saídas substituíveis

O Feedback multimodal será coordenado a partir de eventos semânticos, Preferências do simulador e capacidades do ambiente, sem permitir que Motor, Sessão de digitação ou Experiências do simulador escolham áudio, texto ou tecnologia assistiva. Um coordenador puro produzirá um plano de feedback, e adapters separados executarão texto visual, mensagens acessíveis, Leitura falada do aplicativo e sons da máquina; essa seam preserva o significado quando um meio está ausente ou falha e substitui a interface rasa orientada a arquivos do `AudioProvider` atual.

## Consequências

- Um catálogo localizável resolve identificadores semânticos e parâmetros em texto canônico. Gravações humanas são assets editoriais opcionais, com transcrição e metadados explícitos; conteúdos dinâmicos usam síntese de voz sem depender de gravações.
- A Web Speech API será o adapter inicial da versão web, descoberta em execução e selecionada por localidade e capacidades, não pelo nome fixo de uma voz. A seam permite outro adapter em futuros shells ou um motor incorporado quando houver requisito de offline garantido.
- O simulador não detecta NVDA nem outro leitor de tela. HTML, ARIA e a semântica do Documento Braille permanecem sempre disponíveis; a pessoa pode desligar a voz própria e usar sua tecnologia assistiva para realizar a Leitura do documento.
- A primeira entrada apresenta, visualmente e por semântica acessível, como habilitar ou silenciar a Leitura falada do aplicativo. A escolha é explícita, persiste nas Preferências do simulador e pode ser alterada rapidamente durante a digitação.
- As preferências principais usam nomes e descrições de efeito concretas: Sons da máquina, Leitura durante a digitação, Leitura do documento, Instruções faladas, Avisos e resultados falados e Voz e fala. Controles avançados de voz aparecem separadamente e somente quando a capacidade existe.
- A Leitura durante a digitação pode ficar desligada ou falar pontos Braille, Símbolos textuais, palavras ou linhas. Palavras e linhas são delimitadas pela Interpretação Braille; a Leitura do documento permite examinar posição, palavra, linha, folha ou documento sem mover a Posição de edição.
- Produção frequente da digitação não é duplicada em regiões vivas. Estados importantes continuam como mensagens acessíveis, e o Documento Braille permanece navegável por tecnologia assistiva a qualquer momento.
- Sons da máquina não interrompem fala; leitura solicitada substitui leitura automática obsoleta; instruções longas entram em fila; avisos urgentes podem interromper conteúdo de prioridade menor. Toda fala pode ser interrompida, repetida ou silenciada.
- Regras e progressão não aguardam o fim de áudio. Falha, cancelamento ou indisponibilidade de um adapter não altera o estado do domínio nem impede os outros meios de apresentar o feedback.
