# Feedback multimodal

A capacidade `feedback` transforma fatos semânticos da Sessão de digitação em
planos de saída. O núcleo permanece puro: ele escolhe uma mensagem semântica,
prioridade, política de repetição, interrupção e canais, mas não conhece React,
DOM, arquivos de áudio nem APIs de plataforma.

## Planejamento

`planSessionFeedback` recebe um `SessionEvent` e devolve um `FeedbackPlan`.
Planos com `disposition: 'message'` usam um identificador localizável e
parâmetros estruturados. Planos com `disposition: 'silent'` registram que o
silêncio foi deliberado; a produção frequente do Documento Braille não é
duplicada em regiões vivas.

`coordinateSessionFeedback` recebe todos os fatos de uma transição, preserva a
ordem dos planos de mesma prioridade, aplica supressão entre transições e deixa
mensagens de prioridade maior interromperem somente planos inferiores ainda
pendentes no mesmo lote. Essa política permanece fora da página e dos adapters.

O catálogo em português resolve o identificador somente na fronteira de
apresentação. Assim, texto visual e mensagem programática usam o mesmo conteúdo
canônico sem transformar a UI na fonte do significado.

## Saídas substituíveis

`FeedbackOutput` é a seam dos executores de saída. `executeFeedbackPlan` entrega
um plano resolvido a todas as saídas de forma independente e devolve, para cada
uma, `delivered`, `cancelled` ou `failed`. Cancelamento, indisponibilidade ou
exceção em uma saída não interrompem as demais e não têm acesso ao estado do
domínio.

O adapter de memória é determinístico e inspecionável. Ele permite testar o
mesmo contrato sem DOM, síntese de voz ou reprodução real de sons.

## Integração no Modo livre

`app/pages/FreePage.tsx` entrega todos os fatos produzidos pela sessão ao
coordenador. `ui/feedback/AccessibleFeedback.tsx` mostra cada plano preservado e
atualiza uma região viva com o conteúdo equivalente sem mover o foco da área de
digitação.

O adapter Web Speech recebe texto canônico, localidade BCP 47, finalidade e
características portáveis. Ele seleciona primeiro a localidade completa, depois
o idioma-base, sem transformar o nome bruto de uma voz em preferência.

O adapter web de sons recebe identificadores semânticos e resolve assets dentro
do catálogo. No Modo livre, leitura e sons podem ser ligados, desligados,
repetidos ou interrompidos pelos atalhos documentados. Ausência ou falha da
plataforma não remove o texto nem a semântica acessível.

Instruções e repetições solicitadas explicitamente usam Web Speech mesmo quando
o feedback falado automático está desligado. Assim, I e R continuam sendo
ações disponíveis; P interrompe a saída corrente em qualquer estado de captura.
Quando O ativa a leitura automática, a Interpretação Braille fornece o novo
Símbolo textual produzido; espaços recebem um nome pronunciável e operações de
edição permanecem silenciosas. Unidades por palavra, linha e documento ainda
dependem da política configurável de leitura.

O `AudioProvider` permanece temporariamente apenas para efeitos e destinos
legados. Conteúdo falado do menu e do Modo desafio já usa Web Speech por essa
ponte transitória; os MP3s permanecem ativos somente onde ainda representam
efeitos ou conteúdo legado não migrado. O Modo livre não consome o provider,
evitando feedback duplicado, e cancela fala e sons ao sair da experiência.

## Estratégia de testes

- `feedback.test.ts` verifica decisões do planejador pela interface pública;
- `tests/contracts/feedback-output.test.ts` verifica isolamento entre adapters;
- `tests/contracts/web-speech-output.test.ts` verifica a Web Speech substituída;
- `tests/contracts/web-sound-output.test.ts` verifica sons determinísticos;
- `tests/journeys/free-mode.test.tsx` verifica equivalência de conteúdo e
  preservação de foco pelo DOM acessível.

## Referências

- `docs/adr/0005-feedback-semantico-com-saidas-substituiveis.md`
- `docs/adr/0006-acessibilidade-como-contrato-arquitetural.md`
- `docs/architecture/modules.md`
- `docs/architecture/runtime-flows.md`
