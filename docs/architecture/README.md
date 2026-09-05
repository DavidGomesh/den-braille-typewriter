# Arquitetura do Simulador de Máquina Braille

Esta área descreve a arquitetura alvo da modernização. Ela é a fonte canônica para entender como os módulos se organizam, quais interfaces apresentam e como se comunicam. A arquitetura descrita aqui ainda será implantada de forma incremental; a árvore atual em `src/` permanece legada até que cada capacidade seja substituída e verificada.

## Por onde começar

- [Visão geral](overview.md): problema, princípios e contexto do sistema.
- [Módulos e dependências](modules.md): responsabilidades, interfaces, adapters e dependências permitidas.
- [Fluxos em execução](runtime-flows.md): sequências principais da entrada ao feedback e das Experiências do simulador.
- [Estrutura de diretórios](directory-structure.md): árvore alvo e regras para localizar código e testes.
- [Plano de migração](migration-plan.md): fases, pré-requisitos, versões, auditorias e rollback.
- [Baseline operacional](modernization-baseline.md): marcos recuperáveis, jornadas essenciais, inventário legado e estratégia de rollback.

## Documentação relacionada

- [`CONTEXT.md`](../../CONTEXT.md) define o vocabulário canônico do domínio e não contém decisões de implementação.
- [`docs/adr`](../adr/) registra decisões arquiteturais difíceis de reverter e suas razões.
- Os READMEs das capacidades documentarão suas interfaces, invariantes, adapters e exemplos de uso quando cada capacidade for criada.

## Públicos

| Público | Entrada recomendada |
|---|---|
| Nova pessoa desenvolvedora | [Visão geral](overview.md), seguida de [Módulos e dependências](modules.md) |
| Pessoa implementando uma capacidade | [Estrutura de diretórios](directory-structure.md) e README local da capacidade |
| Pessoa revisando arquitetura | [Módulos e dependências](modules.md) e ADRs relacionadas |
| Pessoa preparando uma apresentação | Diagramas de [Visão geral](overview.md) e [Fluxos em execução](runtime-flows.md) |
| Pessoa planejando uma entrega | [Plano de migração](migration-plan.md) e [`CHANGELOG.md`](../../CHANGELOG.md) |
| Agente de IA | `CONTEXT.md`, ADRs relevantes e estes documentos antes de explorar ou alterar a área |

## Manutenção

Cada fato deve possuir uma fonte canônica:

- mudança no significado de um conceito do domínio: atualizar `CONTEXT.md`;
- decisão difícil de reverter: criar ou substituir uma ADR;
- mudança na arquitetura vigente: atualizar esta área;
- mudança na interface de uma capacidade: atualizar o README local;
- mudança somente interna: não atualizar documentos arquiteturais globais.

Os diagramas usam Mermaid e permanecem junto do texto que explicam. Exportações para slides são cópias derivadas, não fontes canônicas.
