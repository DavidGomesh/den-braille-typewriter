# Baseline técnica moderna

Pesquisa concluída em 25 de agosto de 2026 para orientar a modernização do simulador, sem alterar o código da aplicação. Foram consultadas somente fontes oficiais ou mantidas pelos próprios projetos.

## Decisão recomendada

Adotar a seguinte baseline no início da migração:

| Camada | Baseline | Motivo |
| --- | --- | --- |
| Runtime de desenvolvimento e CI | Node.js 24 LTS | É a linha LTS mais recente; Node.js recomenda produção somente em linhas Active LTS ou Maintenance LTS. |
| Interface | React 19.2, sempre no patch estável mais recente da linha | É a versão documentada como atual pelo projeto React e já é usada pelo template oficial React + TypeScript do Vite. |
| Linguagem e verificação de tipos | TypeScript 6.0.x, inicialmente | É a versão estável mais recente que preserva a API esperada pelo ecossistema e é a escolhida pelo template oficial atual do Vite. TypeScript 7.0 deve ser reavaliado em uma atualização isolada. |
| Build e servidor de desenvolvimento | Vite 8.2.x com `@vitejs/plugin-react` 6.1.x | É a linha que recebe correções regulares e forma uma combinação já exercitada pelo template oficial. |
| Testes unitários e de integração | Vitest 4.1.x + React Testing Library + `user-event` | É a linha estável vigente, compartilha a transformação e a configuração do Vite e favorece testes observáveis pela perspectiva de quem usa o produto. |
| Testes em navegador | Playwright, no patch estável vigente | Exercita teclado, foco, roteamento e fluxos críticos em navegador real; deve complementar, não substituir, testes rápidos do domínio. |

As versões exatas de patch devem ser resolvidas e gravadas pelo `package-lock.json` quando a migração começar. A baseline fixa linhas compatíveis; não recomenda dependências flutuantes nem versões beta, RC ou nightly.

## Compatibilidade verificada

### Node.js

Em 25 de agosto de 2026, Node.js 24 (`Krypton`) é LTS, Node.js 26 ainda é `Current` e Node.js 20 já está em fim de vida. O próprio projeto orienta aplicações de produção a usar somente linhas Active LTS ou Maintenance LTS. Por isso, Node.js 24 é preferível a adotar Node.js 26 antecipadamente. [Node.js Releases](https://nodejs.org/en/about/previous-releases)

O Vite requer Node.js `20.19+` ou `22.12+`; o `create-vite` declara o mesmo intervalo. Node.js 24 satisfaz ambos e também supera o mínimo do Vitest 4, que exige Node.js 20 ou superior. [Getting Started do Vite](https://vite.dev/guide/), [manifesto oficial do `create-vite`](https://github.com/vitejs/vite/blob/main/packages/create-vite/package.json) e [Getting Started do Vitest](https://vitest.dev/guide/)

Recomendação operacional futura: declarar a linha 24 em `engines` e em um arquivo de versão do runtime, e executar CI com uma versão 24.x explicitamente atualizada. Isso evita diferenças silenciosas entre máquinas e automação.

### React

A documentação do React identifica 19.2 como a versão atual. O template oficial React + TypeScript do Vite usa React e React DOM 19.2.x, o que oferece uma combinação contemporânea já mantida em conjunto pela ferramenta de build. [React Versions](https://react.dev/versions) e [template oficial React + TypeScript do Vite](https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/package.json)

A passagem de React 18 para 19 precisa ser tratada como migração, não como simples troca de número. O guia oficial recomenda passar primeiro por React 18.3, que preserva o comportamento de 18.2 e alerta sobre APIs incompatíveis, e então atualizar para 19; ele também lista mudanças incompatíveis de APIs e tipos e fornece codemods. Os codemods podem auxiliar, mas a validação deve vir dos testes de caracterização. [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

O projeto já usa `createRoot`, portanto não depende da API antiga `ReactDOM.render`. Ainda assim, dependências React, tipos, efeitos, refs e integrações com DOM e áudio precisam ser testados com React 19 antes de remover a baseline anterior.

### TypeScript

TypeScript 7.0.2 já é estável e traz um compilador nativo, porém a própria equipe registra que 7.0 ainda não oferece API programática e prevê essa API para 7.1. Ferramentas que incorporam a API do compilador podem precisar permanecer em TypeScript 6.0 ou rodar as duas versões lado a lado. [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) e [release oficial 7.0.2](https://github.com/microsoft/typescript-go/releases/tag/typescript%2Fv7.0.2)

Por esse motivo, a baseline recomendada é TypeScript 6.0.x. A escolha coincide com o template oficial atual do Vite, que fixa TypeScript 6.0.x mesmo depois do lançamento estável do 7.0. [template oficial React + TypeScript do Vite](https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/package.json)

TypeScript 6.0 é uma versão de transição e introduz mudanças relevantes: `strict` passa a ser o padrão, `module` passa a `esnext`, `types` passa a uma lista vazia, e a resolução antiga `node`/`node10` é descontinuada em favor de `bundler` para aplicações empacotadas. A configuração deve declarar explicitamente `moduleResolution: "bundler"`, os tipos globais necessários e os diretórios incluídos. [TypeScript 6.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)

O repositório não declara TypeScript como dependência direta; o lockfile atual contém TypeScript 4.9.5 apenas como peer transitivo. Saltar diretamente para os novos padrões estritos provavelmente revelará erros reais. Isso é desejável, mas deve gerar um inventário e ser corrigido progressivamente, sem desativar `strict` como estado final.

TypeScript 7.0 deve receber um teste controlado depois que build, testes e lint estiverem estabilizados. Ele só deve substituir 6.0 quando todas as ferramentas escolhidas funcionarem sem aliases, versões paralelas ou perda de regras. Essa decisão preserva a preferência por versões modernas sem transformar a primeira migração em integração experimental de toolchain.

### Vite e saída estática

O Create React App foi oficialmente descontinuado. Ele permanece apenas em modo de manutenção, e a equipe React recomenda que aplicações existentes migrem para um framework ou para uma ferramenta de build como Vite, Parcel ou Rsbuild. Para este simulador, que continuará como SPA estática e não possui requisitos atuais de servidor, Vite é a opção de menor expansão arquitetural. [Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)

A linha corrente com correções regulares é Vite 8.2. O Vite recomenda atualizar por versão major usando os respectivos guias e alerta que mudanças em definições TypeScript podem ocorrer entre minors; por isso, o minor deve ser atualizado deliberadamente e validado pelo CI. [Vite Releases](https://vite.dev/releases)

O template oficial oferece uma combinação concreta e compatível: React 19.2.x, TypeScript 6.0.x, Vite 8.2.x e `@vitejs/plugin-react` 6.1.x. Ele também separa verificação de tipos de build (`tsc -b && vite build`). [template oficial React + TypeScript do Vite](https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/package.json)

Essa separação é necessária porque o Vite transpila arquivos TypeScript, mas não faz verificação de tipos. O projeto deve ter um comando explícito de `typecheck` e o CI deve executá-lo independentemente do bundle. [TypeScript no guia de recursos do Vite](https://vite.dev/guide/features#typescript)

O alvo padrão de navegadores do Vite 8 não deriva do `browserslist` usado pelo CRA. Como suporte a pessoas com tecnologias assistivas pode envolver combinações menos recentes de navegador e sistema, a matriz mínima de navegadores precisa ser uma decisão explícita antes de descartar essa configuração; se necessário, o Vite oferece o plugin oficial `@vitejs/plugin-legacy`. [Getting Started do Vite](https://vite.dev/guide/)

Para manter o GitHub Pages, a configuração deverá usar `base: "/den-braille-typewriter/"`, produzir `dist/` e publicar por GitHub Actions. A documentação oficial do Vite recomenda exatamente um `base` com o nome do repositório quando o site vive em `https://<usuário>.github.io/<repositório>/`. [Deploying a Static Site](https://vite.dev/guide/static-deploy#github-pages)

## Impactos específicos da migração do Create React App

O estado atual concentra configuração implícita em `react-scripts` 5.0.1. A migração precisa tornar explícitos os contratos que hoje são escondidos:

1. `public/index.html` deverá se tornar o `index.html` de entrada na raiz e carregar explicitamente o módulo da aplicação; no Vite, o HTML faz parte do grafo de módulos. [Getting Started do Vite](https://vite.dev/guide/)
2. As ocorrências de `%PUBLIC_URL%` no HTML não pertencem ao modelo do Vite. Assets importados pelo código são reescritos no build; assets que precisam conservar nome podem permanecer em `public/` e são referenciados pela raiz pública. [Static Asset Handling](https://vite.dev/guide/assets)
3. URLs dinâmicas de áudio e outros assets precisam respeitar o caminho-base. Para concatenação dinâmica, o Vite fornece `import.meta.env.BASE_URL`; imports e referências estáticas são ajustados automaticamente por `base`. [Building for Production](https://vite.dev/guide/build#public-base-path)
4. A saída muda de `build/` para `dist/` por padrão. O fluxo atual baseado no pacote `gh-pages` deve ser substituído, depois de validado, pelo workflow oficial de GitHub Pages para Vite. [Deploying a Static Site](https://vite.dev/guide/static-deploy#github-pages)
5. O `basename` do React Router está fixado em `/den-braille-typewriter`. Ele deve ser derivado de uma configuração única compatível com `base`, e a navegação direta para rotas deve ser testada no ambiente publicado.
6. `src/index.js` importa arquivos `.tsx`, mas não participa de uma política TypeScript coerente. O ponto de entrada deve passar a TypeScript e o novo `tsconfig` deve cobrir todo o runtime de maneira explícita.
7. O Jest atual está ligado ao ecossistema do CRA: há Jest 27 e configuração que declara `ts-jest`, mas `ts-jest` não está instalado. O fluxo de testes precisa ser tornado executável e observável antes da remoção definitiva de `react-scripts`.

Não se recomenda executar atualização de React, ativação estrita do TypeScript, troca do bundler, migração completa dos testes e reestruturação de módulos em um único commit. Cada mudança altera uma dimensão diferente do diagnóstico e deve deixar build e testes verdes antes da próxima.

## Estratégia de testes

### 1. Domínio puro

Usar Vitest 4.1.x em ambiente Node para combinações de teclas, células Braille, conversão, edição e transições de estado do motor. Essa é a linha estável vigente; Vitest 5 ainda não deve compor a baseline enquanto estiver em pré-lançamento. Vitest reutiliza a transformação e os aliases do Vite, reduzindo a duplicação de pipelines que existe entre bundlers e Jest. [Getting Started do Vitest](https://vitest.dev/guide/) e [Why Vitest](https://vitest.dev/guide/why)

Esses testes devem ser rápidos, determinísticos e independentes de React, áudio e DOM. Antes da extração estrutural, ampliar a caracterização somente dos comportamentos intencionais; defeitos conhecidos devem virar casos pendentes ou tickets, não contratos congelados.

### 2. Componentes e integração de páginas

Usar React Testing Library com `user-event` para renderização semântica, nomes acessíveis, foco e interações observáveis. A biblioteca recomenda testar como a pessoa usa o sistema, evitando detalhes internos, e prioriza consultas por papel e nome acessível. Essa abordagem é especialmente alinhada ao pilar de acessibilidade do simulador. [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) e [prioridade de queries](https://testing-library.com/docs/queries/about#priority)

O ambiente `jsdom` é adequado para grande parte da integração, mas não deve ser a única prova para acordes de teclado, foco, mídia e diferenças de navegador. Os testes devem importar as APIs do Vitest explicitamente ou habilitar globais de forma consciente, e o setup deve carregar `@testing-library/jest-dom/vitest`.

### 3. Fluxos críticos em navegador real

Usar Playwright para poucos fluxos de alto valor: abrir o simulador, navegar entre modos, digitar acordes, editar a saída, operar somente por teclado, preservar foco e carregar assets sob o caminho do GitHub Pages. O Playwright executa componentes e aplicações em navegador real, com cliques, layout e DOM reais; a própria documentação do Vitest alerta que DOM simulado pode produzir falsos positivos e negativos quando APIs reais do navegador importam. [Component testing do Playwright](https://playwright.dev/docs/test-components) e [Why Browser Mode do Vitest](https://vitest.dev/guide/browser/why)

Executar pelo menos Chromium, Firefox e WebKit nos fluxos críticos. Testes automatizados de acessibilidade ajudam, mas não substituem validação manual posterior com leitores de tela, zoom e baixa visão; os critérios detalhados pertencem ao esforço específico de acessibilidade.

## Ordem segura de adoção

1. Fixar Node.js 24 LTS e registrar os comandos atuais de build e teste como baseline reproduzível.
2. Corrigir o executor de testes existente e criar caracterização mínima do domínio e dos fluxos atuais, ainda sem reorganizar módulos.
3. Adicionar TypeScript 6.0 como dependência direta, criar configuração explícita para aplicação e testes e levantar os erros de `strict`.
4. Migrar o shell de build do CRA para Vite 8.2, mantendo o comportamento e as rotas; ajustar HTML, assets, `base`, scripts e saída.
5. Migrar testes unitários e de integração para Vitest 4.1 e React Testing Library; manter os dois executores somente durante a transição e remover Jest depois da equivalência.
6. Atualizar React e React DOM para 19.2 no patch vigente, aplicando o guia oficial e validando dependências e testes.
7. Publicar `dist/` no GitHub Pages por GitHub Actions e validar caminhos de assets, recarga e navegação direta nas rotas.
8. Adicionar os poucos fluxos Playwright críticos e tornar `typecheck`, testes, build e navegador gates do CI.
9. Só então iniciar a refatoração estrutural do motor, features e interface sobre uma toolchain observável.
10. Reavaliar TypeScript 7 em mudança isolada quando lint, plugins e demais consumidores da API do compilador declararem compatibilidade suficiente.

## Critérios para considerar a baseline implantada

- runtime local e CI usam Node.js 24 LTS;
- React 19.2 e Vite 8.2 constam como dependências diretas, em patches estáveis e travados pelo lockfile;
- TypeScript é dependência direta, `strict` é o estado final e existe comando de `typecheck` separado;
- `react-scripts`, a configuração Jest quebrada e o fluxo manual do pacote `gh-pages` foram removidos somente após substituição validada;
- build de produção e GitHub Pages carregam HTML, fontes e áudios sob o caminho do repositório;
- testes do domínio, integração semântica e fluxos críticos em navegador estão verdes no CI;
- a adoção futura do TypeScript 7 permanece uma decisão explícita de compatibilidade, não uma atualização automática.

## Conclusão

A baseline mais moderna **e compatível** para iniciar é Node.js 24 LTS + React 19.2 + Vite 8.2 + TypeScript 6.0 + Vitest 4.1, complementada por React Testing Library e Playwright. TypeScript 7.0 é estável, mas sua ausência temporária de API programática o torna uma segunda migração deliberada. Essa composição remove a dependência do Create React App, preserva o GitHub Pages e cria uma fundação testável antes da refatoração estrutural.
