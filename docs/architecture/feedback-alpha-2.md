# Prontidão de Preferências e Feedback para Alpha 2

Este registro documenta os portões técnicos da fase 6 na jornada do Modo livre.

## Portões

- Preferências usam schema v2 e persistem fala e sons sem identificar uma voz
  pelo nome bruto fornecido pela plataforma.
- Web Speech recebe texto canônico, localidade BCP 47, finalidade, preferência
  lógica, velocidade, pitch e volume, com fallback por idioma-base.
- Sons recebem identificadores semânticos e resolvem assets dentro do adapter.
- Texto e semântica acessível permanecem ativos diante de silêncio,
  indisponibilidade, cancelamento ou falha das saídas.
- O Modo livre permite ativar ou silenciar fala e sons, repetir a última fala e
  interromper as saídas sem mover o foco da área de digitação.
- Não existe detecção de leitor de tela.
- O Modo livre não consome o `AudioProvider`; o executor permanece isolado nos
  destinos legados até a substituição de seus últimos consumidores, sem
  feedback duplicado na jornada modernizada.
- O CI canônico valida formatação, lint, tipos, arquitetura, testes, build e
  auditoria.

## Evidências

- testes de preferências cobrem schema v2, migração e persistência;
- contratos web substituem as APIs reais de fala e som;
- a jornada cobre fala ligada, repetição, interrupção e conclusão sem áudio;
- `npm run ci` registra o portão automatizado final.

## Verificação manual para publicação

1. Ativar a fala com O num navegador com voz `pt-BR`.
2. Repetir com R e interromper com P sem perder o foco.
3. Desativar fala e sons e concluir produção, revisão e correção.
4. Repetir sem voz portuguesa e confirmar o aviso textual sem bloqueio.
5. Avaliar fala ligada e desligada com NVDA/Firefox, NVDA/Chrome e
   VoiceOver/Safari, observando anúncios duplicados.

## Rollback

Reverter a integração restaura temporariamente o executor anterior no Modo
livre. Schemas anteriores permanecem migráveis e nenhuma preferência depende de
uma voz concreta instalada.
