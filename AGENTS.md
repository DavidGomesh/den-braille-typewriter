## Agent skills

### Issue tracker

As tarefas e especificações são gerenciadas em português pelo GitHub Issues. Consulte `docs/agents/issue-tracker.md`.

### Triage labels

As cinco funções canônicas de triagem usam labels técnicas em inglês. Consulte `docs/agents/triage-labels.md`.

### Domain docs

O repositório usa documentação de domínio single-context, escrita em português. Consulte `docs/agents/domain.md`.

### Code language

Código, testes e automações técnicas são escritos em inglês; documentação e comunicação dirigida a pessoas são escritas em português. Consulte `docs/agents/code-language.md`.

### Code documentation

Ao criar ou revisar APIs públicas, invariantes ou lógica interna não evidente,
consulte `docs/agents/code-documentation.md`.

### Changelog

Ao adicionar ou alterar uma entrada em `CHANGELOG.md`, mantenha as mudanças
ainda não publicadas sob `## [Unreleased]`, agrupe-as nas categorias `Added`,
`Changed`, `Deprecated`, `Removed`, `Fixed` e `Security` quando aplicável e
adicione cada nova entrada ao final da categoria correspondente, preservando a
ordem em que as mudanças foram registradas. Não reordene a lista de
`Unreleased` por data, commit ou prioridade. Ao publicar uma versão, mova todo
o conteúdo de `Unreleased` para um cabeçalho no formato `## [versão] -
YYYY-MM-DD`, usando a data real do release; coloque esse novo cabeçalho acima
das versões já publicadas. Preserve as categorias e o formato recomendados pelo
Keep a Changelog.

## Commits

Quando houver autorização para criar um commit, use Conventional Commits no formato `tipo(escopo): descrição`.

- Escreva o `tipo` e o `escopo` em inglês, em minúsculas. Use um escopo curto que identifique o contexto ou a área principal alterada, como `braille`, `keyboard`, `audio`, `ui`, `docs`, `tests` ou `deps`.
- Escreva a descrição, o corpo e os rodapés destinados a pessoas em português.
- Prefira uma descrição curta, no imperativo, sem ponto final.
- Use principalmente `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `perf`, `build`, `ci`, `chore` e `revert`.
- Marque uma mudança incompatível com `!` antes dos dois-pontos e explique seu impacto no corpo ou em um rodapé `BREAKING CHANGE:`.

Exemplos:

- `feat(braille): adiciona combinação para sinal de número`
- `fix(keyboard): corrige repetição ao manter uma tecla pressionada`
- `docs(agents): documenta convenções de commit`
- `chore(deps): atualiza dependências de desenvolvimento`

## Branches

Use prefixos funcionais, como `feature/`, `fix/`, `docs/`, `refactor/` ou
`chore/`, de acordo com a natureza principal da mudança. Nunca use como prefixo
`codex`, `claude`, `gemini` nem o nome de qualquer agente.

## graphify

Este projeto mantém um grafo de conhecimento em `graphify-out/`, com nós centrais,
estrutura de comunidades e relações entre arquivos.

Quando a pessoa usuária digitar `/graphify`, use a skill ou as instruções do
graphify antes de qualquer outra ação.

Regras:

- Para perguntas sobre o código, execute primeiro `graphify query "<pergunta>"`
  quando `graphify-out/graph.json` existir. Use `graphify path "<A>" "<B>"`
  para relações e `graphify explain "<conceito>"` para conceitos específicos.
  Esses comandos retornam um subgrafo delimitado, geralmente muito menor que
  `GRAPH_REPORT.md` ou uma busca textual bruta.
- Alterações pendentes em `graphify-out/` são esperadas após hooks ou atualizações
  incrementais e não justificam ignorar o graphify. Ignore-o somente quando a
  tarefa tratar de uma saída desatualizada ou incorreta do próprio grafo, ou
  quando a pessoa usuária pedir isso explicitamente.
- Quando `graphify-out/wiki/index.md` existir, use-o para navegação ampla em vez
  de explorar diretamente os arquivos-fonte.
- Leia `graphify-out/GRAPH_REPORT.md` apenas em revisões arquiteturais amplas ou
  quando `query`, `path` e `explain` não trouxerem contexto suficiente.
- Após modificar código, execute `graphify update .` para manter o grafo atual
  (somente AST, sem custo de API).
