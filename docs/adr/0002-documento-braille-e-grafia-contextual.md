# Documento Braille como fonte da interpretação contextual

O Documento Braille será a fonte de verdade do conteúdo produzido: ele preserva Impressões de cela numa Grade Braille esparsa, organizada em Folhas Braille ou Papel contínuo virtual, sem lhes atribuir caracteres. A Grafia Braille será um módulo profundo e puro que recebe o documento e um perfil conhecido, resolve internamente os indicadores e demais regras contextuais e devolve uma interpretação estruturada e relacionada às posições de origem; essa forma evita perder o Braille original, os espaços explícitos ou os vestígios de correção, espalhar regras entre os chamadores ou acoplar a geometria a uma única grafia.

## Consequências

- Texto a tinta, áudio e representação visual são projeções da interpretação e não substituem o Documento Braille.
- Uma posição ausente nunca foi utilizada; uma Impressão de cela vazia registra um espaço explícito; pontos apagados fisicamente permanecem como vestígios distintos dos pontos elevados.
- Cada documento registra sua Configuração de papel e pode ser reformado somente por uma operação prévia e confirmada que preserva todas as impressões.
- Sinais podem ocupar uma ou mais celas, e indicadores permanecem explícitos na interpretação mesmo quando não produzem um símbolo textual isolado.
- Trechos pendentes, não reconhecidos ou ambíguos preservam suas celas e produzem diagnósticos em vez de erros ou escolhas silenciosas.
- Os chamadores selecionam um perfil de grafia, mas não controlam seu estado contextual nem conhecem suas tabelas e regras.
- Perfis futuros podem variar a interpretação sobre a mesma geometria de seis pontos; suporte a oito pontos e tradução de texto para Braille exigem decisões próprias.
