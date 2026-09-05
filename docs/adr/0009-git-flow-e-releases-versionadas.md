# Git Flow e releases versionadas

O repositório adotará Git Flow para separar o estado publicado, a integração de funcionalidades concluídas e a estabilização de versões. Embora o projeto tenha atualmente um único mantenedor, essa disciplina torna explícita a promoção até produção e permite experimentar um fluxo de colaboração organizado sem misturar trabalho incompleto com uma release.

## Consequências

- `main` e `develop` serão as únicas branches permanentes de trabalho. `main` representará o estado publicado em produção; `develop` reunirá apenas funcionalidades concluídas e aptas a integrar uma release futura.
- `feature/*` nascerá de `develop`, permanecerá isolada enquanto estiver incompleta e será integrada a `develop` por Squash Merge. Cada feature concluída será representada ali por um único commit.
- `release/*` nascerá de `develop` para estabilizar uma versão sem receber novas funcionalidades. Seus commits de features serão preservados na integração com `main`, sem squash da release, e toda correção de estabilização retornará para `develop`.
- `hotfix/*` nascerá de `main` para uma correção urgente e será integrado a `main`, a `develop` e, quando existir, à release aberta. Branches `feature/*`, `release/*` e `hotfix/*` serão removidas após a integração.
- `main` e `develop` exigirão pull request e CI verde e bloquearão force-push e exclusão. Uma segunda aprovação não será obrigatória enquanto houver apenas um colaborador.
- Commits seguirão Conventional Commits. Tipo e escopo serão escritos em inglês e em minúsculas; a descrição, o corpo e os rodapés destinados a pessoas serão escritos em português.
- Toda alteração em `main` corresponderá a uma publicação deliberada do mesmo commit: tag, GitHub Release e deploy em produção. As versões seguirão Semantic Versioning orientado ao produto; mudanças incompatíveis em comportamentos públicos, dados persistidos, plataformas suportadas ou jornadas determinarão uma nova versão major, não refatorações internas isoladas.
- As tags históricas `v0.1` e `v1.0` permanecerão intactas. A tag `v2.0.0` marcará futuramente o commit `03f4365213c9aa00649f6fbe81904b890c84f211`, e a modernização terá `v3.0.0` como primeira publicação da nova linha.
- A linha da modernização usará tags `v3.0.0-alpha.N` em commits verdes de `develop`, seguidas por `v3.0.0-beta.N` e `v3.0.0-rc.N` na branch `release/v3.0.0`. Todas serão GitHub Prereleases; somente a versão sem sufixo será a publicação final da linha.
- Alpha indica arquitetura incompleta e interfaces ainda mutáveis; Beta indica capacidades funcionalmente completas em estabilização; RC indica conteúdo candidato à versão final, aceitando apenas correções bloqueadoras.
- `CHANGELOG.md` manterá uma seção `Unreleased` e registrará efeitos relevantes para pessoas usuárias e desenvolvedoras, sem reproduzir a lista de commits.
- `the-original` será preservada como branch histórica, sem novos commits. Não será criada uma branch histórica para a versão 2.
- As branches `research/baseline-tecnica`, `research/baseline-acessibilidade` e `feature/reader` poderão ser removidas na execução deste plano: as pesquisas já foram incorporadas e o leitor era um experimento descartado.
- O GitHub Pages passará a receber o artifact de build por GitHub Actions. `gh-pages` será removida somente depois que publicação, rotas, assets, jornadas essenciais e rollback forem validados no novo mecanismo.
