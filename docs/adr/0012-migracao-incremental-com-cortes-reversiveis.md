# Migração incremental com cortes reversíveis

A modernização substituirá a aplicação por capacidades e destinos, depois de estabilizar build, CI, testes e deploy, sem uma reescrita integral. Cada fase manterá a aplicação utilizável, terá critérios de conclusão e rollback próprios e removerá o caminho antigo somente depois que o novo assumir uma única fonte de verdade; essa estratégia foi escolhida para limitar mudanças simultâneas, produzir evidências cedo e permitir retornar a um estado conhecido.

## Consequências

- A troca de CRA por Vite, a atualização das ferramentas, a criação dos módulos puros e a substituição da UI ocorrerão em fases separadas.
- Módulos puros serão implementados de baixo para cima; a apresentação será substituída verticalmente, primeiro no Modo livre e depois no Modo desafio.
- Adapters de compatibilidade poderão existir em cortes curtos, mas não manterão um segundo estado autoritativo.
- A remoção de uma dependência ocorrerá quando seu último consumidor tiver sido substituído e validado.
- Cada mudança relevante executará instalação limpa, verificações, build e auditoria compatíveis com seu risco.
- A linha `v3.0.0` usará Alpha, Beta e Release Candidate com portões objetivos antes da publicação final.

O plano executável, os pré-requisitos e os critérios de cada fase ficam em `docs/architecture/migration-plan.md`, para que a sequência possa receber ajustes sem reescrever esta decisão.
