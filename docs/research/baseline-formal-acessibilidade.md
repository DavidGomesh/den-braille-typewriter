# Baseline formal de acessibilidade

## Decisão recomendada

O simulador deve adotar **WCAG 2.2 nível AA** como alvo internacional verificável e **ABNT NBR 17225:2025** como referência técnica brasileira. A conformidade formal deve abranger todas as rotas, modos, estados relevantes e variações responsivas da SPA, não apenas sua página inicial. O nível AAA não deve ser prometido para o produto inteiro, mas critérios AAA pertinentes podem ser adotados como metas adicionais quando melhorarem diretamente a experiência de pessoas cegas e com baixa visão.

Essa baseline deve ser tratada como condição contínua de qualidade: prevenção automatizada durante o desenvolvimento, testes funcionais, avaliação manual especializada, testes com leitores de tela e validação com pessoas videntes, cegas e com baixa visão. Uma ferramenta automática, isoladamente, não demonstra conformidade nem usabilidade acessível.

## Escopo desta pesquisa

Este relatório define uma baseline para a futura modernização de uma SPA educacional que simula uma máquina Braille. Ele cobre conformidade, teclado, leitores de tela, zoom, contraste, áudio e validação multimodal. Não define o design visual, não escolhe uma biblioteca de componentes e não avalia a conformidade da interface atual.

As recomendações abaixo distinguem:

- **requisito de conformidade**, quando deriva do nível A ou AA da WCAG 2.2;
- **requisito do produto**, quando vai além do mínimo normativo porque acessibilidade é um pilar do simulador;
- **método de validação**, que produz evidência, mas não substitui o requisito.

## Base normativa

### Referência brasileira

O artigo 63 da Lei Brasileira de Inclusão determina acessibilidade nos sites mantidos por empresas com sede ou representação no país e por órgãos de governo, seguindo melhores práticas e diretrizes internacionais. Essa é a moldura legal nacional; a aplicabilidade jurídica exata ao projeto depende de como ele será mantido e oferecido, portanto este relatório não constitui parecer jurídico. ([Lei nº 13.146/2015, art. 63](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm#art63))

A **ABNT NBR 17225:2025 — Acessibilidade em conteúdo e aplicações web — Requisitos** é a norma técnica brasileira vigente e específica para conteúdo e aplicações web. A própria ABNT a apresenta como referência para tornar sites, aplicações e conteúdos digitais acessíveis, e o Governo Federal relaciona sua publicação à implementação do artigo 63 da LBI. A equipe deve consultar uma cópia licenciada da norma durante o detalhamento dos critérios e na auditoria de lançamento, porque este relatório não a reproduz. ([ABNT — lançamento da NBR 17225](https://abnt.org.br/lancamento-da-abnt-nbr-17225/); [Ministério dos Direitos Humanos e da Cidadania — lançamento da norma](https://novoviversemlimite.mdh.gov.br/com-apoio-do-governo-federal-nova-norma-tecnica-da-abnt-e-instituida-para-impulsionar-acessibilidade-digital-no-brasil))

O **eMAG 3.1** pode continuar como fonte complementar de práticas brasileiras, sobretudo se o simulador vier a integrar um serviço do governo federal. Ele foi criado para padronizar sites e portais governamentais e sua versão publicada se baseia na WCAG 2.0; por isso, não deve substituir nem reduzir o alvo mais atual de WCAG 2.2 AA e NBR 17225:2025. ([Governo Digital — Modelo de Acessibilidade](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade); [eMAG 3.1](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/eMAGv31.pdf))

### Referência internacional e nível de conformidade

A **WCAG 2.2** é uma Recomendação W3C estável. O nível AA exige satisfazer todos os critérios A e AA. A conformidade vale para páginas completas e para todas as variações apresentadas automaticamente, inclusive as responsivas; processos completos também precisam conformar em todas as suas etapas. O W3C não recomenda exigir nível AAA para sites inteiros, pois nem sempre todos os critérios AAA são aplicáveis ou alcançáveis. ([WCAG 2.2 — requisitos de conformidade](https://www.w3.org/TR/WCAG22/#conformance-reqs))

Para esta SPA, “página completa” deve ser operacionalizada como o conjunto de cada rota com seus estados alcançáveis: prática livre, desafio, instruções, diálogos, estados vazios, carregamento, sucesso, erro e transições. Isso é uma interpretação de engenharia da regra normativa para impedir que componentes dinâmicos ou estados temporários fiquem fora da avaliação.

Uma declaração pública de conformidade só deve ser feita depois de uma avaliação integral. Até lá, a formulação correta é “o projeto tem WCAG 2.2 AA e ABNT NBR 17225:2025 como alvo”, e não “o projeto é acessível”.

## Baseline funcional por tema

### Estrutura semântica e leitores de tela

1. Usar HTML nativo para títulos, regiões, botões, links, formulários e controles sempre que existir elemento adequado. ARIA complementa a semântica de widgets personalizados; não deve substituir HTML nativo equivalente. ([WAI-ARIA APG — papéis estruturais](https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/))
2. Todo controle deve expor nome, função, estado e valor programaticamente. O texto visível de um controle deve estar contido em seu nome acessível. A ordem de leitura, os títulos e as regiões devem formar uma estrutura compreensível sem depender do layout visual. ([WCAG 2.2 — 1.3.1, 2.4.6, 2.5.3 e 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value); [APG — nomes e descrições acessíveis](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/))
3. Mudanças dinâmicas importantes — caractere produzido, modo ativado, acerto, erro, término de tarefa e alteração de preferência — devem ser percebidas sem mover o foco desnecessariamente. Quando forem mensagens de estado, devem ser anunciáveis por tecnologia assistiva; regiões vivas devem ter prioridade e granularidade adequadas para não interromper ou inundar a fala. ([WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html))
4. Mudanças de rota, abertura e fechamento de diálogos e retorno de ações devem ter uma política explícita de foco. O foco precisa seguir ordem lógica, permanecer visível e não ficar totalmente encoberto. ([WCAG 2.2 — 2.4.3, 2.4.7 e 2.4.11](https://www.w3.org/TR/WCAG22/#focus-order))
5. A representação visual de uma célula Braille precisa ter equivalente textual/programático que identifique seu conteúdo e, quando pedagogicamente necessário, os pontos levantados. Instruções não podem depender apenas de posição, forma, cor ou som. ([WCAG 2.2 — 1.1.1 e 1.3.3](https://www.w3.org/TR/WCAG22/#non-text-content); [W3C — características sensoriais](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html))

Como **requisito do produto**, os fluxos críticos devem funcionar tanto com saída falada quanto com uma linha Braille atualizável conectada por meio do leitor de tela. O NVDA oferece saída e entrada Braille, além de suporte a várias linhas Braille; portanto, a aplicação deve expor texto e estado ao navegador, em vez de tentar implementar um protocolo próprio de hardware. ([NVDA — guia oficial, suporte a Braille](https://download.nvaccess.org/documentation/userGuide.html#BrailleSupport))

### Teclado e digitação Braille por acordes

Toda funcionalidade deve ser operável por interface de teclado, sem exigir tempo específico entre pressionamentos individuais, salvo quando o tempo for inerente à própria função. O usuário deve conseguir percorrer e ativar controles, sair de qualquer componente, reconhecer o foco e concluir as mesmas tarefas disponíveis por ponteiro. ([WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html); [WCAG 2.2 — 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html))

A digitação por acordes usa letras imprimíveis como comandos do simulador. Pela WCAG 2.2, atalhos formados apenas por letras, números, pontuação ou símbolos precisam poder ser desligados, remapeados para incluir uma tecla não imprimível ou permanecer ativos apenas enquanto o componente pertinente estiver focado. Essa regra também alcança sequências e combinações de teclas de caracteres. ([WCAG 2.2 — 2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html))

Consequentemente, a arquitetura deve prever um **modo de captura de acordes** com contrato explícito:

- a captura só começa por ação intencional e dentro de um componente identificável e focado;
- a entrada e a saída do modo são anunciadas e podem ser realizadas apenas pelo teclado;
- existe comando simples para pausar/desligar a captura e as instruções permanecem disponíveis;
- atalhos do navegador, do sistema e da tecnologia assistiva não são bloqueados globalmente;
- campos de texto e controles externos ao simulador não têm suas teclas interceptadas;
- o mapeamento pode ser configurado se testes revelarem conflito com layout de teclado, mobilidade ou tecnologia assistiva;
- manter ou soltar teclas não exige precisão temporal incompatível com recursos como teclas de aderência.

Esse contrato é uma aplicação dos critérios ao comportamento específico do simulador e precisa ser confirmado em testes com pessoas usuárias; ele não presume que a implementação atual já o cumpra.

### Ponteiro, toque e entradas concorrentes

O simulador não deve bloquear uma modalidade porque outra está disponível. Teclado físico, teclado adaptado, toque e ponteiro devem chegar ao motor por adaptadores de entrada independentes, preservando o mesmo resultado de domínio.

No nível AA, gestos multiponto ou dependentes de trajetória precisam de alternativa por ponteiro único; ações de arrastar precisam de alternativa sem arrasto; e alvos devem medir pelo menos 24 × 24 pixels CSS ou cumprir as exceções de espaçamento da WCAG. Como meta adicional do produto, controles primários devem buscar 44 × 44 pixels CSS, correspondente ao critério AAA mais confortável, quando isso não prejudicar a atividade. ([WCAG 2.2 — modalidade de entrada](https://www.w3.org/WAI/WCAG22/Understanding/input-modalities.html); [2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html); [2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))

### Ampliação, refluxo e baixa visão

A baseline para baixa visão deve incluir:

- texto ampliável a 200% sem perda de conteúdo ou funcionalidade;
- refluxo sem rolagem em duas dimensões em largura equivalente a 320 pixels CSS para conteúdo vertical, ressalvadas as exceções essenciais da WCAG;
- conteúdo, foco e controles não encobertos por cabeçalhos, rodapés ou camadas fixas;
- espaçamento de texto ajustável sem perda;
- informações que não dependam somente de cor;
- contraste mínimo de 4,5:1 para texto comum e 3:1 para texto grande;
- contraste mínimo de 3:1 para limites e estados visuais necessários de controles e para partes significativas de gráficos e células Braille;
- foco visual distinguível em todos os componentes interativos.

Esses valores e comportamentos vêm dos critérios 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.12, 2.4.7 e 2.4.11. ([WCAG 2.2 — Distinguishable](https://www.w3.org/WAI/WCAG22/Understanding/distinguishable); [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html); [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html))

O produto não precisa fornecer botões próprios de zoom para satisfazer a WCAG; precisa, sim, não impedir os recursos de ampliação do navegador e do sistema. Como acessibilidade é pilar, também deve validar zoom a 400%, modo de alto contraste/cores forçadas e ampliação do sistema como cenários de usabilidade, mesmo quando forem além de um teste normativo isolado.

### Áudio e equivalência multimodal

Áudio pode reforçar aprendizagem, orientação e feedback, mas não pode ser o único meio de transmitir instruções, conteúdo, estado, erro ou sucesso. Informações sonoras precisam de equivalente textual e programático; informações visuais relevantes precisam ser expressáveis por fala ou Braille; ações não podem ser descritas apenas por características sensoriais. ([WCAG 2.2 — 1.2.1 Audio-only and Video-only](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html); [WCAG 2.2 — 1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html))

O áudio de interface deve obedecer aos seguintes contratos:

- não iniciar automaticamente; se algum áudio automático durar mais de três segundos, deve existir pausa, parada ou volume independente, conforme 1.4.2;
- oferecer controles acessíveis de ligar/desligar e de volume, com estado persistente e perceptível por diferentes modalidades;
- permitir interromper fala, repetição e instruções sem bloquear navegação;
- coordenar os sons do simulador com anúncios do leitor de tela, evitando sobreposição que torne a fala incompreensível;
- oferecer transcrição ou equivalente textual para gravações que contenham informação;
- manter todos os fluxos críticos concluíveis com o áudio do produto desligado.

O W3C destaca que áudio automático pode interferir diretamente na fala do leitor de tela. ([WCAG 2.2 — 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html))

## Método de validação

### Quatro camadas complementares

1. **Prevenção no desenvolvimento:** lint de semântica/ARIA, testes unitários de nomes, estados e foco, e verificações automáticas de regras detectáveis. Falhas automáticas bloqueiam integração, mas aprovação automática nunca equivale a conformidade.
2. **Testes funcionais:** jornadas críticas automatizadas por teclado e ponteiro, incluindo ativação e saída do modo de acordes, mudança de rota, diálogos, erros, áudio desligado, zoom e variações responsivas.
3. **Avaliação manual especializada:** inspeção de todos os critérios A e AA aplicáveis, contraste, ordem de leitura e foco, refluxo, conteúdo com CSS alterado, teclado sem mouse e árvore de acessibilidade.
4. **Tecnologias assistivas e pessoas usuárias:** execução das jornadas por leitor de tela, linha Braille, ampliação e alto contraste, seguida de sessões com pessoas videntes, cegas e com baixa visão.

O W3C afirma que nenhuma ferramenta sozinha determina se um site atende aos padrões e que avaliação humana conhecedora é necessária. A WCAG-EM fornece o processo de definir escopo, explorar o produto, selecionar amostra representativa, avaliar e relatar. Para uma SPA pequena, a preferência deve ser avaliar todas as rotas e estados críticos, usando amostra apenas para conteúdo repetido. ([WAI — Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/); [WAI — WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/))

### Matriz mínima de tecnologias assistivas

A matriz deve usar versões estáveis atuais no momento de cada ciclo e registrar sistema operacional, navegador e tecnologia assistiva testados. A seleção abaixo é um **requisito do produto**, não uma lista prescrita pela WCAG:

| Contexto | Combinação mínima | O que validar |
| --- | --- | --- |
| Windows | NVDA com Firefox e Chrome | leitura estrutural; navegação por títulos, regiões, controles e formulários; foco; modo de acordes; mensagens dinâmicas; saída por fala e Braille |
| macOS | VoiceOver com Safari | mesma jornada crítica no ecossistema nativo da Apple; interação e anúncios em widgets dinâmicos |
| iOS/iPadOS, quando a interface de toque existir | VoiceOver com Safari | exploração por toque, ordem, alvos, gestos simples e mudança entre toque e teclado externo |
| Android, quando a interface de toque existir | TalkBack com Chrome | exploração por toque, controles, regiões, estados dinâmicos e teclado físico |
| Baixa visão | zoom do navegador a 200% e 400%, ampliação do sistema e cores forçadas/alto contraste | refluxo, legibilidade, foco, conteúdo encoberto, contraste e operação sem precisão visual fina |
| Braille atualizável | ao menos uma linha Braille suportada pelo leitor de tela | identificação das células, texto produzido, estados, instruções e conclusão de prática sem confirmação visual |

O NVDA é um leitor de tela gratuito para Windows com saída por fala e Braille; seu guia documenta navegação web e suporte a linhas Braille. VoiceOver e TalkBack são leitores de tela nativos dos ecossistemas Apple e Android; a documentação do TalkBack inclui navegação web com Chrome, títulos, controles e regiões. ([NVDA — guia oficial](https://download.nvaccess.org/documentation/userGuide.html); [Apple — navegar páginas web com VoiceOver](https://support.apple.com/guide/voiceover/browse-webpages-vo27974/mac); [Google — começar a usar TalkBack](https://support.google.com/accessibility/android/answer/6283677); [Google — atalhos e modo de navegação web do TalkBack](https://support.google.com/accessibility/android/answer/6110948))

A compatibilidade real depende da combinação entre conteúdo, navegador e tecnologia assistiva. Por isso, a matriz deve ser revista com dados do público e as combinações de fato suportadas precisam ser documentadas; uma combinação isolada não permite generalizar para todas as pessoas ou tecnologias.

### Jornadas multimodais obrigatórias

Antes de uma versão pública, no mínimo as seguintes jornadas devem ser concluídas:

1. entrar no modo de prática, entender as instruções, produzir, revisar, corrigir e confirmar conteúdo somente pelo teclado;
2. repetir a jornada com leitor de tela e tela ocultada, verificando orientação, foco, anúncios e ausência de dependência visual;
3. repetir com linha Braille atualizável, verificando conteúdo e estados do simulador;
4. concluir a jornada com sons do produto desligados, sem perda de informação;
5. concluir a jornada com zoom a 400%, sem perda de conteúdo, foco ou funcionalidade e sem rolagem bidimensional indevida;
6. concluir por toque e por ponteiro sem depender de acordes, arrasto ou gesto complexo, quando esses adaptadores existirem;
7. alternar entre teclado e ponteiro/toque durante a mesma sessão sem perda de estado ou bloqueio;
8. provocar erros, acertos, mudança de modo e interrupção de áudio, confirmando equivalência visual, sonora e programática.

Testes com pessoas devem envolver mais de um perfil e diferentes níveis de experiência com tecnologia assistiva. O W3C recomenda combinar participação de pessoas com deficiência com avaliação de conformidade e alerta que a experiência de uma única pessoa não representa todo um grupo. Para este produto, cada ciclo relevante deve incluir pessoas cegas e com baixa visão, além de pessoas videntes, e registrar perfil, tecnologia utilizada e escopo da sessão. ([WAI — Involving Users in Evaluating Web Accessibility](https://www.w3.org/WAI/test-evaluate/involving-users/))

## Evidência e critério de aceite

Cada funcionalidade ou refatoração de interface deve registrar critérios de acessibilidade aplicáveis desde o planejamento. Uma entrega só deve ser considerada pronta quando:

- não introduzir falhas conhecidas de WCAG 2.2 A ou AA;
- tiver nomes, papéis, estados, foco e ordem de leitura verificados;
- permitir a jornada correspondente por teclado, sem armadilha e sem captura global indevida;
- mantiver conteúdo e operação com áudio desligado;
- passar pelos cenários relevantes de zoom, refluxo, contraste e espaçamento;
- tiver mensagens dinâmicas verificadas com leitor de tela;
- acrescentar ou atualizar testes de regressão para o comportamento acessível;
- documentar limitações ainda não resolvidas, em vez de ocultá-las.

Para cada auditoria, guardar como evidência: commit ou versão, data, rotas e estados, critérios avaliados, procedimentos, resultado, impacto, capturas quando úteis, ambiente completo de navegador/sistema/tecnologia assistiva e pessoa responsável. Resultados automáticos devem ser separados dos resultados manuais.

Uma futura declaração de acessibilidade deve informar alvo e escopo avaliados, combinações de tecnologia assistiva suportadas, limitações conhecidas, data da última avaliação e um canal acessível para comunicar barreiras. Ela só pode afirmar WCAG 2.2 AA após todos os requisitos de conformidade terem sido avaliados no escopo declarado.

## Consequências para a modernização estrutural

A arquitetura planejada deve criar limites explícitos para:

- **motor de domínio**, sem dependência de DOM, áudio ou dispositivo de entrada;
- **adaptadores de entrada**, separados para acordes de teclado, teclado convencional, toque e ponteiro;
- **política de captura e foco**, centralizada e testável;
- **apresentação semântica**, responsável por nome, papel, estado, relações e mensagens;
- **feedback multimodal**, no qual o mesmo evento de domínio pode alimentar apresentação visual, anúncio programático e áudio opcional;
- **preferências de acessibilidade**, incluindo áudio, modo visual, contraste e mapeamento, por uma interface de persistência;
- **testes de contrato**, garantindo que cada modalidade produza resultados equivalentes sem acoplá-las ao motor.

Essa divisão impede que áudio seja a fonte da verdade, que o componente visual controle as regras Braille ou que listeners globais de teclado dominem toda a aplicação. Ela também permite substituir completamente a interface sem reimplementar o comportamento do simulador.

## Pontos a decidir em etapas posteriores

- critérios AAA adicionais que se tornarão requisitos do produto, além da meta de alvos maiores;
- combinações prioritárias de navegador e tecnologia assistiva após pesquisa com o público;
- biblioteca de componentes e ferramentas automatizadas;
- desenho visual, temas e preferências oferecidas;
- conteúdo pedagógico e nível de detalhamento dos anúncios durante a digitação;
- protocolo de testes com participantes e disponibilidade de linhas Braille;
- processo de auditoria independente e eventual certificação.

Esses pontos não impedem o plano estrutural. A baseline decisória já é suficiente: **WCAG 2.2 AA + ABNT NBR 17225:2025, com acessibilidade tratada como contrato multimodal e validada continuamente por automação, inspeção manual, tecnologias assistivas e pessoas usuárias diversas**.
