# Prontidão da Sessão de digitação para `v3.0.0-alpha.1`

Este registro documenta os portões técnicos do corte que conecta a nova Sessão
de digitação ao Modo livre. Ele não publica nem promove uma versão por si só.

## Escopo validado

- `session` coordena captura, Motor, Documento Braille, Perfil de grafia e
  Configuração efetiva sem depender de React ou DOM;
- o adapter web converte apenas eventos recebidos pela região focada e preserva
  teclas modificadas ou não mapeadas para o navegador;
- o Modo livre produz acordes, espaço, Retrocesso, Espaçamento de linha e
  Retorno do carro através da nova sessão;
- as setas movem a Posição de revisão sem modificar a Posição de edição ou o
  documento;
- perda de foco e ocultação da página interrompem a captura conforme a política
  efetiva e não deixam controles ativos;
- `Escape` pausa ou retoma intencionalmente a captura focada;
- o `textarea` temporário é uma projeção somente leitura; o `BrailleDocument`
  mantido pela sessão é a única fonte de verdade;
- o Modo desafio permanece no caminho legado até seu corte planejado.

## Evidência automatizada

O comando canônico `npm run ci` verifica formatação, lint, TypeScript estrito,
fronteiras arquiteturais, testes, build e auditoria. A jornada automatizada do
Modo livre verifica também:

1. ausência de interceptação fora da região de captura;
2. ativação intencional por foco;
3. produção de acordes e espaço;
4. Retrocesso e mudança de linha como operações distintas;
5. navegação independente da Posição de revisão;
6. preservação do conteúdo ao alternar apresentação e áudio;
7. descarte de acorde incompleto após perda de foco.
8. pausa e retomada explícitas da captura por teclado.

Os testes de `session` e do adapter usam somente `session/public.ts`. A jornada
React usa o DOM acessível e não inspeciona estado interno.

### Resultado registrado

- data: 9 de setembro de 2026;
- branch: `feature/free-mode-session`;
- último commit funcional verificado: `6fb94ad`;
- comando: `npm run ci`;
- resultado: aprovado, com formatação, lint, TypeScript estrito, fronteiras
  arquiteturais, testes, build e auditoria concluídos;
- testes: 9 arquivos e 69 testes Vitest aprovados, além de 30 testes dos
  guardrails em Node aprovados;
- build: 126 módulos transformados e artefato Vite produzido;
- baselines herdadas: 8 falhas de lint isoladas; auditoria com 0
  vulnerabilidades críticas, 4 altas, 1 moderada e 0 baixas.

A verificação manual abaixo foi executada pelo mantenedor em 9 de setembro de
2026, após o pipeline automatizado, e a jornada foi aprovada sem problemas
observados. Navegador, sistema operacional e tecnologias assistivas usados não
foram registrados; por isso, essa validação não substitui a matriz completa de
acessibilidade do marco de release.

## Verificação manual

Ambiente inicial: navegador desktop com teclado físico e build local da branch.

1. Abrir o Modo livre e percorrer a página com `Tab`.
2. Confirmar que a região “Área de digitação Braille” recebe foco visível e
   anuncia “Captura ativa”.
3. Produzir as celas `a` e `b` com `F` e com `F` + `D`; inserir espaço.
4. Usar `Backspace`, produzir outra cela e acionar `Q` para mudar de linha.
5. Alternar Braille/tinta com `T`, solicitar instruções com `I` e alternar os
   sons com `O` e `M`, confirmando que o conteúdo permanece.
6. Manter `F` pressionado, sair da região e liberar a tecla; confirmar que o
   acorde parcial não aparece e que o estado anunciado é “Captura inativa”.
7. Em outro controle ou fora da região, usar uma tecla não mapeada e um atalho
   com modificador; confirmar que a página não os intercepta.

Avaliações com leitores de tela, linha Braille, zoom, refluxo e cores forçadas
continuam pertencendo aos ciclos de acessibilidade definidos para os marcos de
release. Este corte automatiza somente os aspectos observáveis sem julgamento
humano.

## Rollback

Antes da integração, a branch pode ser descartada sem afetar `develop`. Depois
da integração, o rollback seguro é reverter integralmente o commit ou merge do
corte e restaurar o Modo livre anterior. Não existe sincronização entre dois
documentos: reverter troca o adapter inteiro e evita fontes de verdade
concorrentes.
