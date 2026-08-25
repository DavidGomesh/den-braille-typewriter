# Issue tracker: GitHub

As issues e especificações deste repositório são gerenciadas no GitHub Issues. Use o CLI `gh` para todas as operações.

## Idioma

- Títulos e descrições de issues e pull requests devem ser escritos em português.
- Perguntas, respostas, comentários e mensagens dirigidas a pessoas devem ser escritos em português.
- Labels, identificadores técnicos, nomes de arquivos e comandos podem permanecer em inglês.
- Títulos estruturais de documentos também podem permanecer em inglês.
- Termos técnicos sem tradução natural podem permanecer em inglês, desde que o restante do texto esteja em português.

## Convenções

- Criar uma issue: `gh issue create --title "..." --body "..."`.
- Ler uma issue: `gh issue view <número> --comments`, incluindo comentários e labels.
- Listar issues: `gh issue list`, usando filtros de estado e labels quando necessário.
- Comentar: `gh issue comment <número> --body "..."`.
- Aplicar ou remover labels: `gh issue edit <número> --add-label "..."` ou `--remove-label "..."`.
- Fechar: `gh issue close <número> --comment "..."`.

O repositório deve ser inferido a partir de `git remote -v`. Dentro deste clone, o `gh` fará isso automaticamente.

## Pull requests como superfície de triagem

**PRs como superfície de solicitação: não.**

Pull requests não devem entrar automaticamente na fila de triagem das issues.

## Quando uma skill solicitar publicação no issue tracker

Crie uma issue no GitHub, com título e conteúdo em português.

## Quando uma skill solicitar o ticket relevante

Execute `gh issue view <número> --comments`.

## Operações de wayfinding

A skill `wayfinder` usa uma issue principal como mapa e issues relacionadas como tarefas filhas.

- **Mapa:** uma issue com a label `wayfinder:map`, contendo notas, decisões tomadas e pontos ainda incertos.
- **Tarefa filha:** uma issue relacionada ao mapa, preferencialmente como sub-issue nativa do GitHub. Quando isso não estiver disponível, use uma lista de tarefas no mapa e inclua `Parte de #<mapa>` na descrição da tarefa.
- **Tipos:** use labels como `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling` e `wayfinder:task`.
- **Bloqueios:** use dependências nativas do GitHub. Se elas não estiverem disponíveis, registre `Bloqueada por: #<número>` no início da descrição.
- **Seleção:** escolha a primeira tarefa aberta, sem bloqueios e sem responsável, respeitando a ordem do mapa.
- **Assumir uma tarefa:** use `gh issue edit <número> --add-assignee @me`.
- **Concluir:** comente a resposta em português, feche a tarefa e registre no mapa um link para o contexto ou para a decisão resultante.
