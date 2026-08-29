# Experiências compõem Sessões de digitação independentes

Modo livre, Modo desafio e Modo lição serão Experiências do simulador que possuem seus próprios estados e ciclos de vida e compõem a mesma Sessão de digitação por uma seam compartilhada. Não haverá uma interface genérica obrigatória entre experiências: essa composição preserva o comportamento da máquina num módulo profundo, permite que cada experiência evolua sem booleanos de modo e impede que conteúdo, progresso ou avaliação entrem na sessão.

## Consequências

- Somente uma Experiência do simulador fica ativa por vez; trocar de experiência interrompe a captura, mas preserva seus Documentos Braille, posições e progresso estável até abandono ou reinício explícito.
- Cada experiência possui o ciclo de vida de suas Sessões de digitação e de seus documentos. O Modo livre preserva documentos da pessoa, enquanto experiências guiadas podem usar documentos próprios e temporários.
- A Configuração efetiva da sessão combina as Preferências do simulador com Requisitos da experiência temporários. Esses requisitos substituem somente as políticas necessárias e nunca alteram as preferências persistentes.
- Estado, progressão e avaliação de experiências guiadas serão regras TypeScript puras. Conteúdo, sorteio, áudio, persistência e apresentação permanecem fora dessas regras ou entram por adapters quando houver variação real.
- Ações e eventos da experiência são distintos de Intenções da máquina, Comandos da sessão e eventos da sessão. Feedback multimodal consome eventos semânticos sem ser executado pela experiência.
- A apresentação de cada experiência compõe a apresentação compartilhada da Sessão de digitação e acrescenta somente conteúdo e ações próprios; a sessão não recebe flags como `challengeMode` nem conhece palavras, lições, acertos ou erros.
- O Modo desafio avalia uma Sequência Braille esperada contra o trecho de resposta do Documento Braille. A Interpretação Braille explica o resultado, e uma resposta incorreta permanece disponível para revisão e correção até acerto, desistência ou reinício explícito.
