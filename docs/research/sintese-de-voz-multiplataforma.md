# Síntese de voz multiplataforma

## Decisão recomendada

O Simulador de máquina Braille deve adotar uma **seam própria de saída falada**, independente do Motor, da Sessão de digitação, da Grafia Braille, das Experiências do simulador e de React. No primeiro produto web, um adapter da **Web Speech API** deve ser a opção padrão, porque não exige backend nem modelos no bundle e permite falar texto arbitrário. Essa escolha é uma baseline de distribuição, não uma promessa de voz idêntica ou de funcionamento offline em todos os dispositivos.

O contrato deve aceitar texto canônico, localidade BCP 47, finalidade semântica e preferências de voz, velocidade, pitch e volume; deve expor descoberta de capacidades, início, conclusão, cancelamento e falha. A preferência deve selecionar primeiro uma localidade e características, e somente depois uma voz concreta disponível. O nome bruto de uma voz não pode ser a identidade portável da preferência.

Áudios humanos, inclusive gravações futuras de Denise, devem ser assets editoriais explícitos associados a conteúdos específicos. Eles não devem ser procurados implicitamente para cada mensagem. O módulo que coordena feedback escolhe entre um asset humano declarado e a síntese do texto canônico; na ausência ou falha do asset, a síntese pode ser usada conforme a política da experiência.

Um motor incorporado, como `sherpa-onnx` com um modelo cuja licença tenha sido verificada, deve permanecer como alternativa futura para uma distribuição que precise garantir voz offline. Ele não deve entrar agora na aplicação web: o exemplo WebAssembly oficial soma aproximadamente 103 MB entre dados e runtime, antes dos demais assets da aplicação. Serviços remotos, como Google Cloud Text-to-Speech ou Azure Speech, também devem ficar fora do primeiro produto hospedado no GitHub Pages: além de dependerem de rede, custo e tratamento de dados, suas credenciais exigem uma camada de servidor. ([sherpa-onnx — build de TTS para WebAssembly](https://k2-fsa.github.io/sherpa/onnx/tts/wasm/build.html); [Google Cloud — boas práticas para chaves de API](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices))

## Escopo e critérios

Esta pesquisa compara opções pertinentes à aplicação React/Vite hospedada no GitHub Pages e às distribuições futuras em Electron, Tauri e mobile. Os critérios são: português e inglês, descoberta e seleção de vozes, velocidade e pitch, funcionamento offline, acessibilidade, testes determinísticos, licença, tamanho, manutenção e substituibilidade. Ela não seleciona uma voz final nem implementa áudio.

## Web Speech API e vozes do sistema

`speechSynthesis` recebe enunciados de texto e mantém uma fila. Cada `SpeechSynthesisUtterance` pode definir `lang`, `voice`, `volume`, `rate` e `pitch`; a especificação define volume de 0 a 1, rate de 0,1 a 10 e pitch de 0 a 2, mas permite que cada motor ou voz imponha limites menores. Portanto, controles iguais não garantem prosódia igual entre plataformas. ([Web Speech API — seção de síntese](https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#tts-section); [W3C — diferenças de prosódia entre vozes](https://www.w3.org/TR/speech-synthesis/#S3.2.4))

`getVoices()` devolve as vozes que o user agent disponibiliza. Uma voz informa nome, `voiceURI`, localidade BCP 47, se é padrão e se usa um serviço local; nomes não têm garantia de unicidade. A lista pode chegar ou mudar de modo assíncrono, caso coberto pelo evento `voiceschanged`. A própria especificação permite que a voz padrão seja local ou remota e dependa de escolhas do navegador ou do sistema. Em consequência, a aplicação não pode garantir que uma instalação tenha `pt-BR`, `en-US` ou uma voz nomeada sem consultar capacidades em execução. ([Web Speech API — `SpeechSynthesisVoice`, `getVoices` e `voiceschanged`](https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi#tts-section))

O adapter web deve, assim:

- carregar a lista inicialmente e novamente em `voiceschanged`;
- filtrar por localidade completa e depois pelo idioma-base, por exemplo `pt-BR` e depois `pt`;
- preservar a escolha concreta somente enquanto ela continuar disponível;
- oferecer a voz padrão compatível como fallback;
- informar claramente quando não há voz compatível, sem substituir a localidade em silêncio;
- tratar `localService` apenas como dado de capacidade, não como garantia universal de qualidade, latência ou disponibilidade futura, limitações que a própria especificação registra.

Esta opção tem o menor tamanho e manutenção próprios: Vite apenas empacota o adapter JavaScript, enquanto navegador, voz e atualização do sintetizador pertencem ao ambiente. O custo é a variabilidade. A saída sonora, o comportamento de pausa/cancelamento, a qualidade da pronúncia e até a lista de vozes precisam ser validados na matriz real de navegadores e sistemas operacionais.

No Electron, o renderer executa conteúdo web em Chromium, enquanto o processo principal fornece Node.js e capacidades nativas. A mesma seam pode usar inicialmente o adapter Web Speech no renderer; se uma voz incorporada se tornar necessária, outro adapter pode executar no processo principal ou num processo utilitário e devolver áudio por uma ponte estreita. O renderer não deve receber Node.js direto, pois o Electron recomenda isolamento e sandbox. ([Electron — modelo de processos](https://www.electronjs.org/docs/latest/tutorial/process-model); [Electron — sandbox de processos](https://www.electronjs.org/docs/latest/tutorial/sandbox))

No Tauri, o frontend roda no WebView2 no Windows, WKWebView no macOS e WebKitGTK no Linux; em Android, o provedor WebView é um componente do sistema. Portanto, a presença de `speechSynthesis` e de vozes concretas continua ligada ao runtime e à plataforma. A aplicação deve fazer detecção de capacidade, e não inferir equivalência por estar empacotada. ([Tauri — modelo de processos](https://v2.tauri.app/concept/process-model/); [Tauri — versões dos WebViews](https://v2.tauri.app/reference/webview-versions/))

## Motor incorporado e offline garantido

Um motor incorporado troca variabilidade do sistema por responsabilidade do produto: runtime, modelos, licenças, atualizações, desempenho, memória, tempo de inicialização e builds por plataforma passam a ser mantidos pela equipe.

`sherpa-onnx` é hoje a alternativa aberta mais pertinente à seam proposta. A documentação oficial oferece TTS local para Linux, macOS, Windows, Android, iOS, Node.js e WebAssembly, além de APIs em várias linguagens. O pacote Node suporta Linux x64/arm64, macOS x64/arm64 e Windows x64, o que o torna utilizável por um futuro shell Electron; os artefatos Swift oficiais cobrem macOS e iOS. O projeto declara Apache-2.0 para seu código. ([sherpa-onnx — plataformas e APIs](https://github.com/k2-fsa/sherpa/blob/master/docs/source/intro.rst); [sherpa-onnx — pacote Node](https://k2-fsa.github.io/sherpa/onnx/javascript-api/install.html); [sherpa-onnx — pacote Swift](https://github.com/k2-fsa/sherpa-onnx/blob/master/Package.swift); [sherpa-onnx — licença do pacote](https://github.com/k2-fsa/sherpa-onnx/blob/master/pom.xml))

O catálogo oficial lista modelos para português e inglês, mas “suportar o idioma” não seleciona automaticamente uma voz adequada ao português brasileiro. Cada modelo precisa de avaliação de pronúncia, inteligibilidade, latência e licença. O runtime e o modelo têm licenças separadas; a licença Apache-2.0 do `sherpa-onnx` não concede automaticamente direitos sobre todos os modelos. ([sherpa-onnx — catálogo de modelos TTS](https://k2-fsa.github.io/sherpa/onnx/tts/all/))

Piper também oferece síntese local, `pt_BR`, `pt_PT`, `en_US` e `en_GB`. Porém, a implementação atual `piper1-gpl` usa GPL-3.0-or-later e exige consultar o `MODEL_CARD` de cada voz, pois alguns modelos têm licenças restritivas. Incorporá-lo num produto distribuído exige análise jurídica específica sobre a aplicação da GPL ao modo de integração e sobre a licença da voz. ([OHF-Voice — Piper](https://github.com/OHF-voice/piper1-gpl); [Piper — vozes e licenças de modelos](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md))

Por isso, “offline garantido” deve ser uma capacidade do adapter, não uma propriedade presumida de toda saída falada. Uma futura distribuição pode instalar ou baixar pacotes de voz versionados, registrar sua licença e hash e expor a disponibilidade ao mesmo contrato. Na web atual, a ausência de um pacote incorporado não impede que o restante do feedback funcione por texto e tecnologia assistiva.

## Serviços remotos

Um serviço remoto oferece catálogo controlado e qualidade mais uniforme sem incluir modelos no aplicativo. Google Cloud Text-to-Speech recebe texto ou SSML, devolve MP3 ou PCM e permite configurar voz, velocidade, pitch, volume e taxa de amostragem; cobra por quantidade de caracteres. Azure Speech também fornece vozes para `pt-BR` e inglês e permite listar vozes programaticamente. ([Google Cloud — conceitos de Text-to-Speech](https://docs.cloud.google.com/text-to-speech/docs/basics); [Google Cloud — preços](https://cloud.google.com/text-to-speech/pricing/); [Azure Speech — idiomas e vozes](https://learn.microsoft.com/pt-br/azure/ai-services/speech-service/language-support?tabs=tts))

Essa categoria não é adequada como dependência essencial do GitHub Pages. O Google orienta não incluir chaves de API em código cliente e fazer o cliente chamar um servidor que acrescente a credencial. Portanto, uma integração segura introduziria backend, autenticação, quota, custo, telemetria operacional e uma decisão de privacidade sobre o envio do texto falado. ([Google Cloud — boas práticas para chaves de API](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices))

O Azure oferece também Embedded Speech offline, com vozes baixadas para o dispositivo, inclusive `pt-BR`; porém, o recurso exige aprovação de acesso limitado e SDKs/plataformas específicos. Ele é uma opção comercial incorporável futura, não uma baseline aberta para a aplicação atual. ([Azure Speech — Embedded Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/embedded-speech))

## Texto canônico, leitura e gravações humanas

A fonte de verdade de todo conteúdo falado deve ser texto canônico. Isso permite que o Modo desafio fale qualquer palavra nova sem criar um MP3 e que a leitura do Documento Braille escolha unidades diferentes sobre a mesma Interpretação Braille:

- **por símbolo**: fala cada Símbolo textual ou descreve um Segmento de interpretação;
- **por palavra**: agrupa símbolos numa palavra antes de sintetizar;
- **por linha**: sintetiza a interpretação disponível da linha;
- **por posição**: descreve Cela Braille, pontos elevados, estado pendente ou ambíguo quando o objetivo pedagógico exigir o Braille, e não somente o texto a tinta.

Essa segmentação pertence à política de leitura e à Interpretação Braille. O sintetizador recebe texto pronto; ele não deve interpretar o Documento Braille nem decidir se “casa” será pronunciada como palavra ou soletrada.

Uma gravação humana deve ter metadados explícitos: id de conteúdo, localidade, transcrição canônica, pessoa/voz, licença ou autorização, versão e arquivo. A seleção ocorre por política, por exemplo “use a gravação desta introdução quando disponível; caso contrário sintetize sua transcrição”. Isso permite homenagens ou momentos narrativos com a voz de Denise sem espalhar condicionais por componentes e sem limitar palavras dinâmicas às gravações existentes.

## Acessibilidade e leitores de tela

Áudio da aplicação não substitui semântica acessível. Mensagens como captura ativada, resposta incorreta ou etapa concluída devem continuar disponíveis como texto e, quando forem mensagens de estado, por papéis/propriedades que tecnologias assistivas possam anunciar sem mover o foco. ([W3C — WCAG 2.2, mensagens de estado](https://www.w3.org/WAI/WCAG22/Understanding/status-messages))

### Não detectar NVDA ou leitor de tela na aplicação

Uma página web não possui uma API confiável e recomendada para perguntar “NVDA está ativo?” ou “há um leitor de tela falando?”. Isso é intencional: os princípios de design da Web do W3C dizem que APIs não devem permitir que sites detectem o uso de tecnologia assistiva. Essa informação é sensível, pode revelar uma deficiência e pode ser usada para negar ou restringir serviços; eventos antigos propostos para o Accessibility Object Model foram removidos justamente porque revelavam esse uso. ([W3C — Web Platform Design Principles, “Don't reveal that assistive technologies are being used”](https://www.w3.org/TR/design-principles/#do-not-expose-use-of-assistive-tech))

Essa restrição também impede inferências seguras por sinais indiretos. Navegação por teclado, foco, ausência de ponteiro, configurações de contraste ou movimento reduzido não identificam um leitor de tela: pessoas usam combinações variadas de recursos, e tecnologias assistivas incluem leitores de tela, ampliadores, reconhecimento de voz, switches e outras ferramentas. O produto deve responder a preferências explícitas e a capacidades específicas expostas pela plataforma, sem deduzir uma deficiência ou um software em uso. ([W3C — ferramentas e técnicas usadas por pessoas com deficiência](https://www.w3.org/WAI/people-use-web/tools-techniques/); [W3C — Media Queries 4, capacidades de interação](https://www.w3.org/TR/mediaqueries-4/#mf-interaction))

Aplicações Tauri herdam essa ausência no frontend porque executam a interface em WebViews de plataforma. Um plugin nativo poderia tecnicamente consultar APIs específicas de algum sistema operacional, mas isso criaria uma capacidade não portável e trataria informação sensível sem ser necessária para a acessibilidade. A arquitetura não deve introduzir essa detecção. ([Tauri — modelo de processos e WebViews](https://v2.tauri.app/concept/process-model/); [W3C — Web Platform Design Principles](https://www.w3.org/TR/design-principles/#do-not-expose-use-of-assistive-tech))

Electron expõe `app.accessibilitySupportEnabled` somente no macOS e Windows. O valor informa se o **suporte de acessibilidade do Chromium** está habilitado; ele pode ficar verdadeiro quando o Chromium detecta tecnologia assistiva, mas também pode ser ativado manualmente pela aplicação. A API não identifica NVDA, JAWS, VoiceOver ou outro produto, não informa se ele está falando e não cobre Linux. Portanto, ela serve para controlar/examinar a exposição da árvore de acessibilidade do Chromium, não para escolher automaticamente entre ARIA e TTS próprio. O Electron informa ainda que tecnologias assistivas do sistema têm prioridade sobre a configuração manual. ([Electron — `app.accessibilitySupportEnabled`](https://www.electronjs.org/docs/latest/api/app#appaccessibilitysupportenabled-macos-windows); [Electron — acessibilidade](https://www.electronjs.org/docs/latest/tutorial/accessibility))

O Simulador de máquina Braille deve manter sua semântica acessível sempre ativa. HTML e ARIA fornecem ao navegador nomes, funções, estados, relações e regiões vivas; o navegador os mapeia para APIs de acessibilidade, e a tecnologia assistiva decide como apresentar a informação, inclusive por fala ou linha Braille. Esse fluxo funciona sem a página detectar qual tecnologia está consumindo a árvore. ([W3C — visão geral de WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/); [WAI-ARIA 1.1 — regiões vivas](https://www.w3.org/TR/wai-aria-1.1/#dfn-live-region))

Uma região `aria-live` não é um sintetizador controlado pela aplicação. Ela fornece prioridade e granularidade para atualizações sem foco; `polite` sugere anúncio na próxima oportunidade e `assertive` sugere interrupção imediata, mas user agent, tecnologia assistiva ou pessoa podem substituir essa política. Logo, o código não pode observar o anúncio, sua duração ou seu término para coordenar a fila de TTS próprio. ([WAI-ARIA — `aria-live`](https://www.w3.org/TR/wai-aria-1.1/#aria-live))

### Evitar fala duplicada sem detectar tecnologia assistiva

Não existe como garantir automaticamente que uma região viva e a síntese própria nunca falarão juntas, pois a página não sabe se ou quando a tecnologia assistiva anunciou a região. A solução deve ser controle explícito e uma política conservadora:

- toda informação necessária permanece em texto e semântica acessível, independentemente da preferência de saída falada;
- **leitura falada da aplicação** começa desativada até escolha explícita ou é habilitada por uma ação claramente descrita; essa preferência permanece disponível sem perguntar se a pessoa usa leitor de tela;
- quando a leitura própria estiver habilitada, mensagens frequentes e não críticas não devem ser enviadas simultaneamente a uma região viva e ao sintetizador; o coordenador escolhe um canal falado principal conforme a preferência, preservando o texto visual e a semântica estrutural;
- estados indispensáveis à operação continuam programaticamente determináveis. Se também forem sintetizados pela aplicação, a interface explica que leitores de tela podem repetir o anúncio e oferece um controle rápido para silenciar a leitura própria;
- `aria-live="assertive"` fica reservado a interrupções realmente imperativas; a própria especificação alerta que interrupções podem desorientar e impedir a conclusão da tarefa;
- testes manuais verificam as combinações leitor de tela + leitura própria ligada/desligada. Não se cria uma ramificação de produto baseada em detecção.

Essa política preserva o requisito de mensagens de estado da WCAG, que exige que tecnologias assistivas possam apresentá-las sem mover foco, e respeita a autoridade da pessoa sobre como recebe a saída. ([W3C — WCAG 2.2, mensagens de estado](https://www.w3.org/WAI/WCAG22/Understanding/status-messages); [WAI-ARIA — `aria-live`](https://www.w3.org/TR/wai-aria-1.1/#aria-live))

A saída falada da aplicação e a fala do leitor de tela podem competir pelo mesmo canal. A WCAG observa que áudio automático dificulta ouvir leitores de tela e exige pausa/parada ou volume independente quando toca automaticamente por mais de três segundos; o W3C recomenda iniciar fala a partir de uma ação intencional. ([W3C — WCAG 2.2, controle de áudio](https://www.w3.org/WAI/WCAG22/Understanding/audio-control))

Assim, o produto deve:

- manter “leitura falada da aplicação” independente de anúncios acessíveis e de feedback mecânico;
- oferecer interromper, repetir, silenciar e ajustar volume/velocidade sem depender do volume geral do sistema;
- não reproduzir automaticamente instruções longas antes que a pessoa consiga localizar o controle de parada;
- evitar anunciar a mesma frase simultaneamente por região viva e síntese própria; a política deve permitir que pessoas que usam leitor de tela desativem a leitura da aplicação sem perder significado;
- testar com NVDA/Firefox e NVDA/Chrome no Windows, VoiceOver/Safari no macOS e iOS, TalkBack/Chrome no Android e combinações Linux selecionadas, além de testar sem leitor de tela.

## Seam e testes determinísticos

Um contrato conceitual suficiente seria:

```text
Pedido de fala
├── texto canônico
├── localidade BCP 47
├── finalidade: leitura | instrução | estado | resultado
├── prioridade e política de interrupção
└── preferências: voz lógica, rate, pitch e volume

Capacidades de fala
├── localidades e vozes disponíveis
├── local ou remoto
├── controles efetivamente suportados
└── disponibilidade offline conhecida

Resultado
└── iniciado | concluído | cancelado | indisponível | falhou
```

O contrato não deve expor `SpeechSynthesisVoice`, `HTMLAudioElement`, objetos de SDK ou caminhos de modelo. Um adapter Web Speech traduz o pedido para `SpeechSynthesisUtterance`; um adapter de assets toca uma gravação; um adapter incorporado produz áudio local; um adapter remoto chama uma API por backend.

Testes unitários do Motor, da Sessão de digitação, da Grafia Braille e das Experiências do simulador não devem produzir som. Eles verificam fatos e pedidos semânticos. Testes do coordenador de feedback usam um adapter falso, com capacidades fixas e conclusão controlada pelo teste. Assim é possível testar fila, prioridade, cancelamento, fallback, leitura por símbolo/palavra/linha e falhas sem depender da duração, da voz ou dos eventos reais do sistema.

Testes de integração específicos verificam o adapter Web Speech com uma implementação substituída da API; apenas uma matriz manual/end-to-end pequena deve validar vozes reais, porque a lista e a prosódia pertencem ao ambiente e não são determinísticas. Para engines incorporadas, amostras de áudio não devem ser comparadas byte a byte entre arquiteturas; os testes devem fixar a versão do modelo, verificar geração, duração/faixa plausíveis e realizar avaliação auditiva para português e inglês.

## Matriz de decisão

| Opção | Web/GitHub Pages | Electron/Tauri/mobile | Offline | Vozes pt/en | Tamanho e manutenção | Papel recomendado |
| --- | --- | --- | --- | --- | --- | --- |
| Web Speech API | direta, sem backend | possível no WebView/Chromium, com detecção | somente quando a voz exposta for local | depende do dispositivo | mínimo para o projeto; alta variabilidade | baseline atual |
| Assets humanos | direta | direta | sim, após baixar/instalar | somente conteúdo gravado | cresce por gravação e idioma | conteúdo editorial especial |
| `sherpa-onnx` + modelo | WASM possível, mas pesado | amplo suporte nativo | sim | existem modelos; qualidade/licença exigem validação | runtime e modelos sob manutenção do produto | candidato futuro para offline garantido |
| Piper atual | integração própria | sobretudo nativa/serviço local | sim | `pt_BR`, `pt_PT`, `en_US`, `en_GB` | GPL-3.0 e licenças por voz | avaliar somente com revisão jurídica |
| TTS em nuvem | exige backend seguro | exige backend ou credencial segura | não | catálogo amplo e controlado | custo, quota, privacidade e operação | opcional futuro conectado |

## Próximas decisões, sem antecipar implementação

1. Definir as categorias e prioridades de feedback e a política de interrupção entre leitura, instrução, estado e som mecânico.
2. Definir como a Interpretação Braille é segmentada para leitura por símbolo, palavra, linha e posição.
3. Prototipar a Web Speech API na matriz mínima de plataformas e registrar quais vozes `pt-BR` e `en-US` aparecem, a qualidade e os limites reais de rate/pitch.
4. Antes de prometer desktop offline, comparar um modelo `pt-BR` incorporado com vozes nativas de Windows, macOS e Linux, incluindo tamanho, latência e licença.
5. Definir a política editorial e a autorização para gravações humanas.

## Fontes primárias consultadas

- [W3C — Web Speech API Specification](https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi)
- [W3C — Speech Synthesis Markup Language 1.1](https://www.w3.org/TR/speech-synthesis/)
- [W3C — WCAG 2.2: Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control)
- [W3C — WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [W3C — Web Platform Design Principles](https://www.w3.org/TR/design-principles/#do-not-expose-use-of-assistive-tech)
- [W3C — WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/)
- [Electron — Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Electron — Process Sandboxing](https://www.electronjs.org/docs/latest/tutorial/sandbox)
- [Electron — Accessibility](https://www.electronjs.org/docs/latest/tutorial/accessibility)
- [Electron — `app.accessibilitySupportEnabled`](https://www.electronjs.org/docs/latest/api/app#appaccessibilitysupportenabled-macos-windows)
- [Tauri — Process Model](https://v2.tauri.app/concept/process-model/)
- [Tauri — Webview Versions](https://v2.tauri.app/reference/webview-versions/)
- [sherpa-onnx — documentação de TTS](https://k2-fsa.github.io/sherpa/onnx/tts/index.html)
- [sherpa-onnx — TTS WebAssembly](https://k2-fsa.github.io/sherpa/onnx/tts/wasm/build.html)
- [OHF-Voice — Piper](https://github.com/OHF-voice/piper1-gpl)
- [Google Cloud — Text-to-Speech](https://docs.cloud.google.com/text-to-speech/docs/basics)
- [Google Cloud — boas práticas para chaves de API](https://docs.cloud.google.com/docs/authentication/api-keys-best-practices)
- [Azure Speech — idiomas e vozes](https://learn.microsoft.com/pt-br/azure/ai-services/speech-service/language-support?tabs=tts)
- [Azure Speech — Embedded Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/embedded-speech)
