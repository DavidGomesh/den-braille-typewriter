# Simulador de Máquina Braille

> A arquitetura alvo da modernização está documentada em
> [`docs/architecture`](docs/architecture/README.md). A estrutura atual ainda é
> legada e será migrada de forma incremental.

Vite é o único caminho ativo de desenvolvimento, build e publicação. O
GitHub Pages recebe o artifact `dist/` pelo workflow automatizado; o caminho
anterior permanece recuperável somente pelo histórico Git.

## Ambiente reproduzível

O projeto usa Node.js 24.20.0, fixado em `.nvmrc`, e mantém npm com o
`package-lock.json` versionado. Com `nvm`, prepare uma instalação limpa assim:

```sh
nvm install
nvm use
npm ci
npm run ci
```

`npm run ci` executa a mesma interface operacional usada pelo GitHub Actions:
formatação, lint contra a baseline herdada, typecheck sem emissão, testes,
build Vite e auditoria. Nenhuma dessas verificações reescreve arquivos. A
auditoria aceita somente as ocorrências críticas ou altas registradas por
advisory e pacote; o lint rejeita qualquer aviso que não esteja na fotografia
versionada.

As exceções herdadas ficam em `config/lint-baseline.json` e
`config/audit-baseline.json`. Cada baseline registra motivo, risco, responsável
e prazo; reduções ou prorrogações precisam ser feitas explicitamente nesses
arquivos.

## Comandos

### `npm start`

Executa o servidor de desenvolvimento Vite. A aplicação fica disponível em
`http://localhost:5173/den-braille-typewriter/`.

### `npm test`

Executa a suíte Vitest em modo interativo.

### `npm run format`

Verifica a formatação com Prettier sem modificar arquivos. Documentos de
arquitetura e pesquisa, fontes e código de terceiros permanecem fora desse
guardrail.

### `npm run lint`

Executa o ESLint e rejeita qualquer falha que não esteja na baseline herdada.

### `npm run typecheck`

Executa o TypeScript sobre `src` sem emitir arquivos.

### `npm run test:ci`

Executa uma vez a suíte da aplicação com Vitest e as políticas de automação
com o runner nativo do Node.js, sem ativar o modo interativo.

### `npm run ci`

Executa localmente, uma vez cada, todos os guardrails usados pela integração
contínua.

### `npm run build`

Produz o artifact Vite no diretório `dist/`, configurado para ser servido sob
`/den-braille-typewriter/`.

### `npm run audit`

Audita dependências de produção e rejeita regressões em relação à baseline.

### `npm run preview`

Serve localmente o conteúdo de `dist/` sob a mesma base de publicação.
