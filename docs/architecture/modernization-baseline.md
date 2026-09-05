# Baseline operacional anterior à modernização

Esta baseline registra o ponto de partida recuperável da modernização estrutural. Ela descreve o que existe na linha `v2`, não transforma limitações ou defeitos do código legado em requisitos da arquitetura nova.

## Marcos e referências

| Finalidade | Referência | Compromisso |
| --- | --- | --- |
| Código publicado da linha `v2` | commit `03f4365213c9aa00649f6fbe81904b890c84f211`, marcado por `v2.0.0` | A tag é imutável e identifica o código da aplicação antes da modernização. |
| Artifact publicado antes da modernização | branch `gh-pages`, commit `b1f5f49b0e5ca82aec07d18c7e652895cd499e25` | Pode ser republicado enquanto o deploy por Vite e GitHub Actions não tiver sido validado. |
| História original | branch `the-original`, commit `284c0b8d54eded8baf958c1eeee305231e690423` | A branch permanece histórica e não recebe novos commits. |
| Estado de planejamento aprovado | `main` no início do ticket #25, commit `518d14cff3a916cdf0c84daf45a8e836c7bd8386` | Contém o plano, as ADRs e as pesquisas que orientam a modernização. |
| Linha de integração | branch `develop`, criada ao concluir o ticket #25 | Recebe somente incrementos concluídos e verificáveis da modernização. |

As tags históricas `v0.1` e `v1.0` permanecem em seus objetos atuais. Nenhuma tag existente deve ser movida para executar um rollback.

## Jornadas essenciais da versão atual

Estas jornadas delimitam a continuidade mínima durante os primeiros cortes. Os critérios aprovados de domínio e acessibilidade têm precedência quando o comportamento legado divergir deles.

### Escolher uma Experiência do simulador

1. Abrir o início da aplicação publicada.
2. Identificar Modo livre e Modo desafio.
3. Acessar cada experiência por sua opção de navegação.
4. Receber, quando o navegador permitir, a gravação associada ao item focado.

### Produzir conteúdo no Modo livre

1. Abrir o Modo livre e focar a área de digitação.
2. Produzir celas com os controles físicos `F`, `D`, `S`, `J`, `K` e `L`, confirmando cada conjunto quando seus controles forem liberados.
3. Produzir espaço e mudança de linha.
4. Alternar entre a apresentação Braille e a apresentação a tinta.
5. Solicitar novamente as instruções e controlar separadamente os sons do teclado e da saída.
6. Examinar a produção apresentada sem perder o conteúdo já digitado.

### Responder no Modo desafio

1. Abrir o Modo desafio e receber uma palavra sorteada por gravação.
2. Repetir a palavra ou solicitar as instruções.
3. Produzir a resposta por acordes e confirmá-la.
4. Receber feedback de acerto ou erro.
5. Depois de um acerto, receber uma nova palavra e continuar a experiência.

### Continuidade multimodal

- A navegação, a digitação e a confirmação continuam disponíveis por teclado físico.
- A produção continua apresentável em Braille ou tinta.
- Gravações e sons continuam disponíveis onde já compõem a jornada, mas sua implementação atual não é referência arquitetural.
- Modo livre e Modo desafio permanecem alcançáveis durante cada corte que não os substitua explicitamente.

## Inventário técnico legado

O manifesto declara 18 dependências de produção e duas dependências de desenvolvimento; algumas ferramentas de desenvolvimento estão classificadas como produção e serão reposicionadas ou removidas nos cortes próprios. Este é o inventário direto verificável:

| Dependência declarada | Classificação atual | Consumidor ou finalidade observada |
| --- | --- | --- |
| `@fortawesome/fontawesome-svg-core` | produção | infraestrutura dos ícones Font Awesome |
| `@fortawesome/free-brands-svg-icons` | produção | catálogo de marcas disponível à apresentação |
| `@fortawesome/free-regular-svg-icons` | produção | catálogo regular disponível à apresentação |
| `@fortawesome/free-solid-svg-icons` | produção | catálogo sólido disponível à apresentação |
| `@fortawesome/react-fontawesome` | produção | componentes React para ícones |
| `@testing-library/jest-dom` | produção | assertions de DOM nos testes legados |
| `@testing-library/react` | produção | renderização de componentes nos testes legados |
| `@testing-library/user-event` | produção | simulação de interação nos testes legados |
| `bootstrap` | produção | estrutura, controles, estilos e JavaScript da interface |
| `fp-ts` | produção | utilitários funcionais disponíveis ao código legado |
| `gh-pages` | produção | publicação manual do build CRA |
| `immutable` | produção | celas, controles, produção e Modo desafio |
| `react` | produção | componentes e estado da aplicação |
| `react-dom` | produção | inicialização da aplicação no navegador |
| `react-router-dom` | produção | rotas de início, Modo livre e Modo desafio |
| `react-scripts` | produção | desenvolvimento, testes e build CRA |
| `use-sound` | produção | suporte de reprodução usado pelo feedback sonoro legado |
| `web-vitals` | produção | medição opcional da aplicação CRA |
| `@types/jest` | desenvolvimento | tipos do runner legado |
| `jest` | desenvolvimento | runner declarado diretamente além do fornecido por CRA |

Uma dependência declarada sem consumidor confirmado continua no inventário para verificação e remoção explícita; ausência aparente de uso não autoriza remoção nesta fase.

O lockfile contém 1.622 pacotes registrados. Em 5 de setembro de 2026, o Dependabot apresentava 128 alertas abertos: 3 críticos, 64 altos, 48 médios e 13 baixos. A consulta direta por `npm audit --json` falhava antes de produzir o relatório, ao tentar resolver `@fortawesome/fontawesome-svg-core`; essa falha também pertence à baseline reproduzível a ser tratada no ticket seguinte.

Esses números são uma fotografia, não uma tolerância permanente. A modernização não investirá na atualização isolada de dependências descartáveis, mas nenhuma mudança poderá introduzir silenciosamente um novo risco crítico ou alto de produção.

## Estratégia de rollback

1. Antes do corte de build, manter o artifact da branch `gh-pages` e o commit `v2.0.0` recuperáveis.
2. Se uma mudança de configuração ou proteção bloquear o fluxo, reverter somente a regra incorreta; nunca mover tags ou reescrever branches históricas.
3. Se uma feature ainda incompleta falhar, não promovê-la a `develop`.
4. Se um incremento já integrado falhar, reverter seu commit ou merge completo e retornar ao último commit verde de `develop`.
5. Durante a futura migração de deploy, republicar o artifact estável conhecido até que o artifact Vite seja validado.
6. Registrar o commit, o artifact, o motivo e as verificações de qualquer rollback executado.

Um rollback recupera uma versão conhecida; ele não mantém duas fontes de verdade nem sincroniza indefinidamente caminhos antigo e novo.

## Proteções da integração

- `main` e `develop` bloqueiam exclusão e force-push.
- Mudanças entram por pull request.
- Uma segunda aprovação não é exigida enquanto houver somente uma pessoa colaboradora.
- Checks obrigatórios serão associados às proteções quando a integração contínua correspondente existir, para não exigir um contexto que ainda não pode executar.
- Features incompletas permanecem em `feature/*`; releases e hotfixes seguem a ADR de Git Flow.

Esta baseline deve ser atualizada somente para corrigir um fato sobre o ponto de partida. Resultados e exceções das fases seguintes pertencem às evidências de cada ticket e ao changelog.
