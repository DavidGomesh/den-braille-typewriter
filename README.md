# Simulador de Máquina Braille

> A arquitetura alvo da modernização está documentada em
> [`docs/architecture`](docs/architecture/README.md). A estrutura atual ainda é
> legada e será migrada de forma incremental.

Durante a migração de plataforma, Vite e Create React App (CRA) coexistem para
permitir a comparação dos artifacts. Vite é o novo caminho em validação; os
comandos sem sufixo continuam apontando para a baseline CRA até o corte.

## Ambiente reproduzível

O projeto legado usa Node.js 24.20.0, fixado em `.nvmrc`, e mantém npm com o
`package-lock.json` versionado. Com `nvm`, prepare uma instalação limpa assim:

```sh
nvm install
nvm use
npm ci
npm run ci
```

`npm run ci` executa a mesma interface operacional usada pelo GitHub Actions:
lint contra a baseline herdada, testes, builds CRA e Vite e auditoria. A
auditoria aceita somente as ocorrências críticas ou altas já registradas por
advisory e pacote; o lint rejeita qualquer aviso que não esteja na fotografia
versionada. Os avisos conhecidos do ambiente legado e as
jornadas verificadas estão documentados em
[`docs/architecture/node-24-baseline.md`](docs/architecture/node-24-baseline.md).

## Available Scripts

In the project directory, you can run:

### `npm start`

Executa o servidor de desenvolvimento legado do CRA em
[http://localhost:3000](http://localhost:3000).

### `npm run start:vite`

Executa o servidor de desenvolvimento Vite. A aplicação fica disponível em
`http://localhost:5173/den-braille-typewriter/`.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:ci`

Executa uma vez a suíte legada, sem ativar o modo interativo.

### `npm run ci`

Executa localmente todos os guardrails usados pela integração contínua.

### `npm run build`

Produz o artifact legado do CRA no diretório `build/`.

### `npm run build:vite`

Produz o novo artifact Vite no diretório `dist/`, configurado para ser servido
sob `/den-braille-typewriter/`.

### `npm run preview:vite`

Serve localmente o conteúdo de `dist/` sob a mesma base de publicação.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
