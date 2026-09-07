# Corte do build Vite

Este documento registra a introdução do Vite pelo ticket #28 e a conclusão do
corte de plataforma pelo ticket #30. Vite 8.2 e `@vitejs/plugin-react` 6.1
permanecem ativos sem atualizar React nem antecipar a migração para Vitest.

## Comandos e artifacts

- `npm start` inicia o desenvolvimento Vite em `/den-braille-typewriter/`;
- `npm run build` produz o artifact Vite em `dist/` e prepara o Pages;
- `npm run preview` serve esse artifact sob a base configurada.

O HTML de entrada do Vite fica na raiz do projeto e referencia o mesmo ponto de
entrada React usado pelo CRA. O bootstrap JSX foi separado de `src/index.js`
para que os dois bundlers consumam a mesma composição sem duplicá-la. Os assets
públicos mantêm nomes estáveis; fontes importadas por CSS entram no grafo do
Vite com hash.

O campo `homepage` de `package.json` permanece como fonte única da base.
`vite.config.mjs` deriva dele a base do bundler e `process.env.PUBLIC_URL`,
usado pelo React Router. O artifact
resultante referencia scripts, folhas de estilo, manifesto, ícones e fontes sob
`/den-braille-typewriter/`. As URLs relativas de áudio continuam resolvendo a
partir das rotas existentes, preservando o comportamento observado na baseline
legada.

## Corte e rollback

Durante a comparação curta, CRA e Vite coexistiram e `legacy-peer-deps` isolou
os conflitos dos peers antigos. O ticket #30 removeu essa exceção, as
dependências, os scripts e a configuração do CRA. O caminho anterior agora é
recuperável somente pelos commits anteriores ao corte.

O rollback consiste em reverter o corte completo ou republicar um artifact
Vite estável conhecido pelo workflow de Pages. Nenhum comportamento de React,
rota ou apresentação foi redesenhado.

## Evidências

Na comparação encerrada em 5 de setembro de 2026, com Node.js 24.20.0:

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
