# Changelog

Todas as mudanças relevantes deste projeto serão registradas neste arquivo. As descrições são escritas em português e seguem as categorias de Keep a Changelog; as versões seguem Semantic Versioning.

## [Unreleased]

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

### Changed

- TypeScript passa para 6.0.3 em modo estrito, com typecheck sem emissão e
  política para supressões justificadas e locais.
- React e React DOM chegam à baseline 19.2.8 após a versão de transição,
  com adapters de teste e ícones compatíveis e inicialização por `createRoot`.
- Vite passa a ser o único caminho de desenvolvimento, build e publicação; o
  caminho concorrente do Create React App foi removido.

[Unreleased]: https://github.com/DavidGomesh/den-braille-typewriter/compare/v1.0...HEAD
