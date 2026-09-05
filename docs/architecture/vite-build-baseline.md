# Build Vite equivalente

Esta evidência registra o primeiro corte da migração de plataforma, referente ao
ticket #28. Ele introduz Vite 8.2 e `@vitejs/plugin-react` 6.1 sem atualizar
React, substituir Jest ou remover o caminho Create React App (CRA).

## Comandos e artifacts

- `npm run start:vite` inicia o desenvolvimento Vite em
  `/den-braille-typewriter/`;
- `npm run build:vite` produz o artifact Vite em `dist/`;
- `npm run preview:vite` serve esse artifact sob a base configurada;
- `npm start` e `npm run build` preservam temporariamente o servidor e o
  artifact CRA em `build/` para comparação.

O HTML de entrada do Vite fica na raiz do projeto e referencia o mesmo ponto de
entrada React usado pelo CRA. O bootstrap JSX foi separado de `src/index.js`
para que os dois bundlers consumam a mesma composição sem duplicá-la. Os assets
públicos mantêm nomes estáveis; fontes importadas por CSS entram no grafo do
Vite com hash.

O campo `homepage` de `package.json` permanece como fonte única da base durante
a coexistência. O CRA já o consome, enquanto `vite.config.mjs` deriva dele a
base do bundler e `process.env.PUBLIC_URL`, usado pelo React Router. O artifact
resultante referencia scripts, folhas de estilo, manifesto, ícones e fontes sob
`/den-braille-typewriter/`. As URLs relativas de áudio continuam resolvendo a
partir das rotas existentes, preservando o comportamento observado na baseline
legada.

## Coexistência e rollback

O CRA traz peers antigos de Babel que conflitam com a resolução moderna do
plugin React do Vite. Enquanto as duas cadeias coexistem, `.npmrc` mantém a
política `legacy-peer-deps` de forma explícita e reproduzível para `npm ci`.
Ela desativa a rejeição de conflitos de peers para toda a árvore; portanto,
incompatibilidades passam a ser detectadas pelos testes e pelos dois builds, em
vez de interromperem a instalação. `@DavidGomesh` é responsável por remover a
exceção até a conclusão do ticket #30, junto com as dependências do CRA.

O rollback deste corte consiste em usar os comandos sem sufixo e o artifact
`build/`. Nenhum comportamento de React, rota ou apresentação foi redesenhado.

## Evidências

Em 5 de setembro de 2026, com Node.js 24.20.0:

- `npm ci` instalou 1.623 pacotes a partir do lockfile;
- os builds CRA e Vite foram produzidos, respectivamente, em `build/` e
  `dist/`;
- ambos os builds passaram a integrar `npm run ci` e o workflow de pull request;
- as três jornadas provisórias passaram com os mesmos 23 testes da baseline;
- o servidor Vite carregou Início, Modo livre e Modo desafio sob a base do
  projeto; no Modo livre, o acorde da tecla `F` produziu a cela `a`;
- rotas, manifesto, favicon e uma amostra de áudio responderam com HTTP 200 sob
  `/den-braille-typewriter/`;
- a auditoria registrou 3 vulnerabilidades críticas, 37 altas, 15 moderadas e
  15 baixas de produção. Três ocorrências herdadas de `nanoid` deixaram de
  existir, e nenhuma ocorrência crítica ou alta foi introduzida.

O navegador continuou bloqueando a reprodução automática de instruções antes
de uma interação da pessoa. Esse comportamento já pertence à aplicação legada
e não impediu navegação, digitação nem carregamento dos arquivos de áudio.
