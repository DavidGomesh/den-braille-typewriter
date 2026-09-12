# Changelog

Todas as mudanças relevantes deste projeto serão registradas neste arquivo. As descrições são escritas em português e seguem as categorias do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); as versões seguem Semantic Versioning. As datas aparecem nos cabeçalhos das versões publicadas no formato `YYYY-MM-DD`.

## [Unreleased]

## [3.0.0-alpha.2] - 2026-09-12

### Added

- Preferências do simulador versionadas, validadas e persistidas no Modo livre,
  com migração explícita, fallback seguro e adapters web e determinístico.
- Planejador puro de Feedback multimodal com mensagens visuais e programáticas
  equivalentes no Modo livre e saídas determinísticas isoladas contra falhas.
- Leitura falada por Web Speech e sons opcionais substituíveis no Modo livre,
  com preferências portáveis, interrupção, repetição e fallback sem áudio.

### Fixed

- Conteúdo falado do menu, das instruções e das palavras do desafio usa síntese
  de voz sem sobrepor gravações; os controles do Modo livre continuam ativos
  após perda de foco, a tecla O controla a leitura automática dos símbolos e
  todas as saídas são interrompidas ao sair da experiência.

## [3.0.0-alpha.1] - 2026-09-09

### Added

- Documentação da arquitetura alvo por capacidades, com diagramas, interfaces e estrutura de diretórios.
- Plano incremental da modernização, incluindo pré-lançamentos, critérios de conclusão, auditorias e rollback.
- Baseline operacional da versão anterior à modernização, com jornadas essenciais, inventário técnico e referências recuperáveis.
- Ambiente legado reproduzível no Node.js 24, com instalação pelo lockfile, CI e baseline verificável de vulnerabilidades.
- Separação contínua entre falhas herdadas de lint e novas regressões, com auditoria por advisory e pacote.
- Desenvolvimento e build Vite equivalentes ao CRA, com artifact próprio e base de publicação do projeto.
- Documento Braille editável e revisável com configuração e reformatação de
  folha finita ou papel contínuo, preservando impressões e vestígios físicos.
- Interpretação contextual pela Grafia Braille para a Língua Portuguesa de
  2018, com segmentos rastreáveis e estados pendente, ambíguo e não reconhecido.
- Convenção de documentação de código e TSDoc nos contratos públicos da
  capacidade Braille, com fluxo completo entre motor, documento e interpretação.
- Sessão de digitação pura e adapter web de teclado integrados ao Modo livre,
  com captura focada e Documento Braille como única fonte de verdade.

### Changed

- TypeScript passa para 6.0.3 em modo estrito, com typecheck sem emissão e
  política para supressões justificadas e locais.
- React e React DOM chegam à baseline 19.2.8 após a versão de transição,
  com adapters de teste e ícones compatíveis e inicialização por `createRoot`.
- Vite passa a ser o único caminho de desenvolvimento, build e publicação; o
  caminho concorrente do Create React App foi removido.

[Unreleased]: https://github.com/DavidGomesh/den-braille-typewriter/compare/v3.0.0-alpha.2...HEAD
[3.0.0-alpha.2]: https://github.com/DavidGomesh/den-braille-typewriter/releases/tag/v3.0.0-alpha.2
[3.0.0-alpha.1]: https://github.com/DavidGomesh/den-braille-typewriter/releases/tag/v3.0.0-alpha.1
