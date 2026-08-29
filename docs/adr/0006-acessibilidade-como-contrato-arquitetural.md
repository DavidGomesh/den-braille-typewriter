# Acessibilidade como contrato arquitetural distribuído

A acessibilidade será um contrato transversal da arquitetura, com WCAG 2.2 AA e ABNT NBR 17225:2025 como piso. Cada módulo preservará as invariantes que controla, os módulos compartilharão fatos semânticos estruturados e as jornadas completas serão verificadas por critérios globais. Não haverá um módulo central que tente corrigir barreiras depois que elas forem produzidas.

## Consequências

- Motor, Sessão de digitação, Documento Braille e Experiências do simulador não conhecem DOM, cores, texto de interface ou adapters de áudio. Eles produzem estado e fatos semânticos localizáveis, sem mensagens prontas para apresentação.
- A UI responde pela apresentação semântica e executa intenções de foco declaradas pelos fluxos. Cada destino navegável define título, região principal, foco inicial e regra de retorno, sem misturar foco do DOM, Posição de edição e Posição de revisão.
- O Feedback multimodal decide quais fatos exigem texto, mensagem acessível, Leitura falada do aplicativo ou som, assim como prioridade, repetição e silêncio. Falha de um adapter não altera o estado do domínio nem impede os demais meios.
- Jornadas críticas preservam resultado e significado entre modalidades, sem exigir apresentações idênticas. Elas permanecem concluíveis sem visão e com a Leitura falada do aplicativo desligada.
- A apresentação do Documento Braille permite examinar sua Interpretação Braille ou descrever suas Impressões de cela, com posição e relação com as celas de origem preservadas.
- A captura de acordes começa somente por ação intencional numa região focada e identificável. Entrada, pausa, retomada e saída são operáveis e anunciáveis por teclado; interrupções não deixam captura residual; adapters não interceptam globalmente campos externos ou atalhos do ambiente.
- Preferências do simulador guardam escolhas permanentes de apresentação. Requisitos da experiência podem substituí-las temporariamente na Configuração efetiva da sessão, informando a substituição e restaurando a preferência ao final.
- Uma Experiência do simulador pode ocultar uma Interpretação Braille que revele a resposta pedagógica, inclusive em tinta ou fala, mas deve manter instruções, estados, ações e uma representação adequada, como a descrição dos pontos, acessíveis.
- A futura UI oferecerá uma paleta limitada e impedirá combinações abaixo do contraste mínimo. Os detalhes de temas, fundos, textos e bordas pertencem ao futuro design visual.
- O suporte verificado será declarado por uma matriz versionada de navegadores, sistemas e tecnologias assistivas realmente testados, sem prometer compatibilidade universal não verificada.
- Toda alteração executa verificações automáticas comuns e os testes adicionais indicados por seu impacto. Marcos de lançamento executam a avaliação completa.
- Procedimentos manuais registram preparação, ambiente e versões, passos, resultado esperado, aspectos a observar, evidências, data, pessoa responsável e limitações.
- Violações conhecidas de WCAG 2.2 A ou AA e barreiras que impeçam jornadas críticas bloqueiam o lançamento. Limitações fora desse piso exigem registro explícito de impacto, alternativa e acompanhamento.
- Checklists e automação não substituem avaliação manual nem testes em ciclos relevantes com pessoas videntes, cegas e com baixa visão.
