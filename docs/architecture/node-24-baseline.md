# Baseline reproduzível no Node.js 24

Esta baseline registra a execução da aplicação legada para o ticket #26. Ela
não aprova os defeitos e riscos herdados nem autoriza a atualização isolada das
dependências que serão removidas nos próximos cortes.

## Ambiente e comandos

- Node.js 24.20.0, fixado em `.nvmrc` e limitado à linha `24.x` pelo campo
  `engines` do manifesto;
- npm, com instalação determinada pelo `package-lock.json` versão 3;
- `npm ci` para a instalação limpa;
- `npm run test:ci` para a execução não interativa dos testes;
- `npm run build` para o artifact CRA em `build/`;
- `npm run audit:baseline` para impedir o aumento de vulnerabilidades críticas
  ou altas de produção sobre a fotografia registrada.

A CI executa esses comandos no mesmo Node.js em pull requests e em mudanças de
`develop`, `main` e `release/**`.

## Resultado de referência

Em 5 de setembro de 2026, uma instalação limpa registrou 1.620 pacotes
adicionados. As quatro suítes React passaram com 23 testes, a política da
auditoria passou seus três cenários, e o build de produção foi gerado
corretamente para `/den-braille-typewriter/`.

As jornadas essenciais ganharam testes provisórios pela interface React. Eles
exercitam as interações observáveis e substituem somente os meios externos: o
navegador é representado por jsdom e o elemento de áudio por um adapter
determinístico que registra cada solicitação de reprodução. A validação também
foi complementada pela execução manual abaixo. O roteiro completo permanece em
`modernization-baseline.md`.

## Execução manual das jornadas essenciais

Execução realizada em 5 de setembro de 2026, no Chromium do navegador interno,
contra o servidor CRA iniciado em `127.0.0.1:3000` com Node.js 24.20.0. A
execução automatizada complementar confirmou que foco, instruções, repetição,
celas, acerto e erro solicitam os arquivos de áudio esperados e que o build os
mantém disponíveis. A percepção sonora por ouvido humano fica fora deste
guardrail automatizado.

| Jornada | Passos executados | Resultado observado |
| --- | --- | --- |
| Escolher experiência | Abrir o início e seguir as opções por teclado para Modo livre e Modo desafio | As duas opções foram expostas como links e ambas abriram sua experiência. |
| Produzir no Modo livre | Focar a saída, acionar `F`, espaço, mudança de linha, `T`, `O`, `M` e `I` | A cela `a` e o espaço apareceram; os comandos preservaram o conteúdo e a experiência permaneceu operável. |
| Responder no Modo desafio | Abrir a experiência e acionar repetição, instruções e confirmação | A palavra sorteada e os controles foram apresentados; a execução automatizada adicional produziu por acordes a palavra sorteada, verificou feedback de erro e acerto, limpeza da resposta e novo sorteio. |
| Continuidade multimodal | Alternar apresentação e áudio durante a digitação e examinar a saída | A saída continuou disponível e editável após as alternâncias. |

Esta é uma evidência temporária da aplicação legada. Jornadas completas em um
navegador real serão adicionadas nos cortes previstos pelo plano de migração.

## Avisos herdados observados

- Jest conclui os testes, mas informa que não encerrou imediatamente após a
  execução;
- `babel-preset-react-app` usa um plugin Babel sem declará-lo diretamente;
- Node.js informa o uso obsoleto de `fs.F_OK` durante o build;
- Browserslist informa que sua base está desatualizada;
- o lint embutido no build aponta dependências ausentes em hooks e uma função
  não utilizada;
- npm informa pacotes obsoletos e scripts de instalação bloqueados por sua
  política atual.

Esses avisos pertencem ao caminho CRA recuperável e serão tratados nos tickets
que substituem ou modernizam suas ferramentas. Nenhum deles impediu os comandos
da baseline.

## Dependências e vulnerabilidades

O inventário de dependências diretas e seus consumidores permanece em
`modernization-baseline.md`. A instalação limpa contém 1.621 dependências de
produção reportadas pela auditoria, incluindo dependências opcionais e peers.

Em 5 de setembro de 2026, `npm audit --omit=dev --json` registrou:

| Severidade | Quantidade |
| --- | ---: |
| Crítica | 3 |
| Alta | 38 |
| Moderada | 16 |
| Baixa | 15 |
| Total | 72 |

As contagens e os IDs GHSA herdados também estão em
`config/audit-baseline.json`. A verificação aceita reduções, mas bloqueia tanto
qualquer ID crítico ou alto novo quanto o aumento das contagens nessas
severidades. Como o CRA classifica ferramentas no conjunto de produção, esta fotografia inclui
vulnerabilidades de build e desenvolvimento; a classificação será corrigida
quando essas dependências forem substituídas ou removidas.
