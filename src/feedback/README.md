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

`app/pages/FreePage.tsx` entrega os fatos produzidos pela sessão ao planejador e
mantém somente o último plano apresentável. `ui/feedback/AccessibleFeedback.tsx`
mostra o conteúdo visual e atualiza uma região viva equivalente sem mover o
foco da área de digitação.

Áudio e fala substituíveis serão conectados no corte seguinte da capacidade;
esta etapa cobre o texto visual e as mensagens programáticas da issue #43.

## Estratégia de testes

- `feedback.test.ts` verifica decisões do planejador pela interface pública;
- `tests/contracts/feedback-output.test.ts` verifica isolamento entre adapters;
- `tests/journeys/free-mode.test.tsx` verifica equivalência de conteúdo e
  preservação de foco pelo DOM acessível.

## Referências

- `docs/adr/0005-feedback-semantico-com-saidas-substituiveis.md`
- `docs/adr/0006-acessibilidade-como-contrato-arquitetural.md`
- `docs/architecture/modules.md`
- `docs/architecture/runtime-flows.md`
