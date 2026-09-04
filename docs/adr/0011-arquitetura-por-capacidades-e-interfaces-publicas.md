# Arquitetura por capacidades e interfaces públicas

A modernização organizará o código por capacidades do produto, com módulos profundos acessados por interfaces públicas deliberadas. Essa forma foi escolhida para concentrar regras e mudanças, proteger o núcleo TypeScript de React, DOM e plataforma e permitir que a aplicação web atual e futuros shells componham as mesmas capacidades sem duplicar o domínio.

## Consequências

- As capacidades de primeiro nível serão `app`, `braille`, `session`, `experiences`, `feedback`, `preferences` e `ui`.
- Cada capacidade, exceto a raiz de composição `app`, publicará sua interface por `public.ts`. Imports externos de detalhes internos serão proibidos.
- `app` será a composition root: selecionará adapters, criará estados e conectará capacidades, sem conter regras do produto.
- `braille` e `preferences` não dependerão de outras capacidades do produto. `session`, `experiences`, `feedback`, `ui` e `app` seguirão a direção acíclica documentada em `docs/architecture/modules.md`.
- React e apresentação ficarão em `ui`; Motor, Documento Braille, Grafia Braille, Sessão de digitação, Experiências do simulador e planejamento de Feedback multimodal permanecerão TypeScript puro.
- Adapters ficarão junto da capacidade proprietária da seam que satisfazem e serão identificados pela plataforma quando necessário.
- Testes de módulos ficarão próximos da implementação; contratos, regras arquiteturais e jornadas completas terão áreas próprias em `tests/`.
- `CONTEXT.md` continuará sendo somente o glossário do domínio. A visão arquitetural vigente ficará em `docs/architecture`, e decisões difíceis de reverter continuarão em ADRs.

Foram rejeitadas a organização principal por camadas técnicas (`components`, `providers`, `services` e `utils`), uma pasta global de infraestrutura e um store global sem necessidade compartilhada concreta. Essas alternativas dispersariam as regras das capacidades, criariam dependências pouco visíveis e reduziriam a portabilidade do núcleo.
