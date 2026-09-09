## Agent skills

### Issue tracker

As tarefas e especificações são gerenciadas em português pelo GitHub Issues. Consulte `docs/agents/issue-tracker.md`.

### Triage labels

As cinco funções canônicas de triagem usam labels técnicas em inglês. Consulte `docs/agents/triage-labels.md`.

### Domain docs

O repositório usa documentação de domínio single-context, escrita em português. Consulte `docs/agents/domain.md`.

### Code language

Código, testes e automações técnicas são escritos em inglês; documentação e comunicação dirigida a pessoas são escritas em português. Consulte `docs/agents/code-language.md`.

### Changelog

Ao adicionar ou alterar uma entrada em `CHANGELOG.md`, comece cada item com a
data `DD/MM/YYYY` em que a mudança entrou no histórico, seguida de `—` e
da descrição em português. Confirme a data no histórico do Git (`git blame` ou
`git log`) quando registrar mudanças existentes e preserve as categorias
`Added`, `Changed`, `Fixed` e demais categorias já usadas no arquivo.

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
