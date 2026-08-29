# Distribuição instalável multiplataforma

Pesquisa concluída em 28 de agosto de 2026 para responder à pergunta “Qual estratégia preserva o GitHub Pages agora e deixa o Simulador de máquina Braille preparado para distribuição instalável futura no Windows, macOS, Linux e dispositivos móveis?”. Foram consultadas somente especificações, documentação oficial e páginas mantidas pelos próprios projetos.

## Resposta curta

Manter **React + Vite como aplicação web estática** e tratar cada forma de distribuição como um **shell externo e opcional**. A próxima entrega pode continuar no GitHub Pages e, quando houver valor comprovado, o mesmo build web poderá receber:

1. manifest e service worker para virar PWA;
2. um shell desktop Electron **ou** Tauri, escolhido somente depois de testes de acessibilidade nas plataformas-alvo;
3. se uma loja móvel ou API nativa realmente exigir, um shell Capacitor ou Tauri mobile.

GitHub Pages e Electron não são alternativas equivalentes. Pages hospeda HTML, CSS e JavaScript estáticos; Electron empacota recursos em executáveis para Windows, macOS e Linux. Portanto, Pages não “roda Electron”, mas pode continuar hospedando a aplicação web enquanto GitHub Actions produz instaladores separados e GitHub Releases ou lojas os distribuem. [GitHub Pages: definição oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) e [Electron: visão geral de distribuição](https://www.electronjs.org/docs/latest/tutorial/distribution-overview)

Não existe base técnica para garantir que Electron, Tauri ou qualquer fornecedor sobreviverá intacto por 20 ou 30 anos. A proteção real contra esse horizonte é manter o domínio, os dados e a interface web fora das APIs do empacotador, aderir a padrões da Web e fazer dos shells integrações substituíveis. Essa recomendação coincide com as ADRs locais: o motor e a Sessão de digitação já foram definidos como módulos puros, serializáveis e independentes de React, DOM, áudio, dispositivo e efeitos ([ADR 0001](../adr/0001-motor-braille-como-transicao-pura.md) e [ADR 0003](../adr/0003-sessao-de-digitacao-como-coordenadora-pura.md)).

## O que cabe no GitHub Pages

GitHub Pages publica arquivos HTML, CSS e JavaScript, aceita builds por workflow customizado e fornece HTTPS, inclusive para domínios personalizados. Isso é suficiente para uma SPA React/Vite e para os componentes web de uma PWA; HTTPS também satisfaz o requisito de contexto seguro para instalação de PWA. [GitHub Pages: hospedagem estática](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [fonte por GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) e [HTTPS no Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

Um site de projeto vive por padrão sob `/<repositório>/`; por isso, o build Vite, o manifest, o `start_url`, o escopo do service worker, rotas e URLs de áudio precisam derivar de uma única base configurável, nunca assumir `/`. O guia oficial do Vite manda configurar `base: '/<REPO>/'` para esse formato de GitHub Pages. [Vite: deploy no GitHub Pages](https://vite.dev/guide/static-deploy#github-pages)

Pages não hospeda processos Node/Rust nem entrega, por si, executáveis assinados. Os artefatos desktop/mobile são construídos para cada plataforma em jobs separados e publicados como releases, downloads ou pacotes de loja. O próprio Tauri documenta uma pipeline no GitHub Actions que cria releases e alimenta atualizações; o Electron documenta o empacotamento e a publicação após assinatura. [Tauri: pipeline no GitHub](https://v2.tauri.app/distribute/pipelines/github/) e [Electron: visão geral de distribuição](https://www.electronjs.org/docs/latest/tutorial/distribution-overview)

## PWA: a primeira camada instalável

Uma PWA continua sendo o mesmo site. Um Web App Manifest fornece identidade, ícones, URL inicial e modo de exibição; navegadores compatíveis podem instalá-la com ícone e janela independente, sem baixar um executável criado pelo projeto. A instalação promovida exige HTTPS (ou localhost no desenvolvimento), mas o suporte e a experiência variam por navegador e sistema: Chromium oferece instalação nos desktops suportados; Safari oferece “Add to Dock” nas versões documentadas; Firefox desktop não promove instalação por manifest. No mobile, Android tem suporte em vários navegadores e iOS/iPadOS expõe instalação pelo menu de compartilhamento, com diferenças de versão. [MDN: tornar uma PWA instalável](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)

O service worker é uma capacidade separada da instalação. Ele pode interceptar requisições e servir Cache Storage offline, mas não controla a primeira visita; sua atualização tem ciclo próprio, e uma nova versão normalmente espera as janelas controladas pela anterior fecharem. Portanto, “instalável” não significa automaticamente “funciona offline”, e atualização precisa de UX explícita e testes contra versões antigas de caches e dados. [web.dev: service workers](https://web.dev/learn/pwa/service-workers)

Para este simulador, a PWA é especialmente pertinente porque a experiência principal pode ser inteiramente local. O shell da aplicação, fontes e áudios essenciais podem ser pré-armazenados; Documentos Braille e Preferências do simulador precisam de persistência versionada independente do cache de assets. IndexedDB, Web Storage e Cache Storage têm papéis distintos e compartilham quotas por origem; dados importantes não devem existir somente no cache descartável do service worker. [web.dev: dados offline](https://web.dev/learn/pwa/offline-data)

A PWA é a única opção comparada que adiciona instalação e offline sem criar outra superfície de runtime, assinatura e atualização nativa. Ela não garante presença uniforme em lojas nem paridade de APIs do sistema; publicação em catálogos pode envolver wrappers e requisitos próprios de cada loja. [web.dev: instalação e catálogos](https://web.dev/learn/pwa/installation)

## Electron: desktop consolidado, não mobile

Electron é explicitamente um framework desktop para Windows, macOS e Linux. Ele inclui Chromium e Node.js no aplicativo e permite que o renderer use HTML, CSS e JavaScript; iOS e Android não aparecem entre suas plataformas suportadas. Logo, Electron não torna o produto mobile: uma estratégia móvel continua exigindo PWA ou outro shell. [Electron: introdução](https://www.electronjs.org/docs/latest/) e [Electron: plataformas binárias](https://www.electronjs.org/docs/latest/tutorial/installation)

Essa inclusão do runtime dá ao desktop um Chromium conhecido e acesso nativo por um processo principal Node, mas cria manutenção contínua. Electron lança majors em cadência de oito semanas e suporta oficialmente somente as três linhas estáveis mais recentes; o projeto instrui aplicações a usar uma versão corrente para receber correções do Chromium, Node e do próprio Electron. Em agosto de 2026, isso significa planejar upgrades frequentes, não congelar uma versão “para décadas”. [Electron: política de releases](https://www.electronjs.org/docs/latest/tutorial/electron-timelines) e [Electron: segurança](https://www.electronjs.org/docs/latest/tutorial/security)

A separação correta é renderer web isolado e sandboxed, preload mínimo e APIs privilegiadas pequenas via IPC, com validação de remetente. Carregar conteúdo remoto com privilégios Node aumenta materialmente o risco; a documentação recomenda conteúdo seguro, `contextIsolation`, sandbox, CSP, navegação limitada e versão atual. Para reduzir acoplamento e risco, um eventual Electron deve empacotar o build local e não transformar a aplicação React em código Node. [Electron: modelo de processos](https://www.electronjs.org/docs/latest/tutorial/process-model) e [Electron: checklist de segurança](https://www.electronjs.org/docs/latest/tutorial/security)

Electron herda a acessibilidade de HTML/Chromium e habilita recursos automaticamente quando detecta tecnologia assistiva, como JAWS ou VoiceOver. Isso preserva o valor de HTML semântico, mas não prova compatibilidade: os fluxos de Acorde Braille, foco, anúncios e teclado precisam ser testados com leitores de tela reais em cada sistema. [Electron: acessibilidade](https://www.electronjs.org/docs/latest/tutorial/accessibility/)

Distribuir exige empacotar e, na prática, assinar. A documentação alerta que Windows e macOS dificultam a execução de aplicativos sem assinatura; macOS também requer notarização para distribuição fora da loja. O updater embutido cobre macOS e Windows, exige assinatura no macOS e não oferece suporte embutido no Linux, onde o projeto recomenda o gerenciador de pacotes da distribuição. [Electron: assinatura](https://www.electronjs.org/docs/latest/tutorial/code-signing) e [Electron: `autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater/)

## Tauri: desktop e mobile com menor runtime próprio

Tauri 2 aceita qualquer frontend compilado para HTML/CSS/JavaScript, usa um core majoritariamente Rust e o WebView do sistema, e declara suporte a Windows, macOS, Linux, Android e iOS. A linha 1.0 saiu em 2022 e a 2.0 estável, que introduziu mobile, em outubro de 2024; isso demonstra atividade e releases atuais, mas uma história estável bem mais curta que a pilha web e não sustenta uma garantia de décadas. [Tauri 2.0: anúncio oficial](https://v2.tauri.app/blog/tauri-20/)

Não embutir o navegador reduz o tamanho do runtime distribuído, mas transfere variabilidade ao sistema: WebView2/Chromium no Windows, Android WebView no Android, WKWebView no ecossistema Apple e WebKitGTK no Linux. O próprio projeto registra que a versão depende do provedor/OS e que versões antigas de macOS sem suporte deixam de receber WebKit. Isso aumenta a importância de uma matriz de testes para APIs Web, áudio, teclado e acessibilidade — especialmente no Linux, onde Electron e Tauri não necessariamente expõem a mesma árvore e o mesmo comportamento. [Tauri: versões dos WebViews](https://v2.tauri.app/reference/webview-versions/) e [Tauri: modelo de processos](https://v2.tauri.app/concept/process-model/)

O desenvolvimento também traz Rust e dependências nativas: no Windows, Microsoft C++ Build Tools e WebView2; no macOS/iOS, Xcode; no Linux, toolchain e bibliotecas WebKitGTK por distribuição; mobile acrescenta os SDKs correspondentes. Isso não impede reutilizar React/Vite, mas aumenta o custo operacional frente a uma PWA. [Tauri: pré-requisitos](https://v2.tauri.app/start/prerequisites/)

Tauri gera instaladores e pacotes para as cinco plataformas e documenta assinatura por plataforma. A assinatura é exigida na maioria delas; macOS fora da loja requer notarização, Android exige assinatura para Play Store e iOS exige certificado/provisionamento. Seu plugin de updater exige uma assinatura própria dos artefatos, sem opção de desativá-la, além da assinatura exigida pelo sistema operacional. [Tauri: distribuição](https://v2.tauri.app/distribute/), [Tauri: updater](https://v2.tauri.app/plugin/updater/), [Tauri: assinatura Android](https://v2.tauri.app/distribute/sign/android/) e [Tauri: assinatura iOS](https://v2.tauri.app/distribute/sign/ios/)

O suporte mobile deve ser avaliado com cautela: no lançamento da 2.0 o projeto afirmou que nem todos os plugins oficiais suportavam mobile e que plugins poderiam ter quebras em minors conforme sua estabilidade. Portanto, “um framework para cinco plataformas” não equivale a uma API idêntica em todas. [Tauri 2.0: anúncio oficial](https://v2.tauri.app/blog/tauri-20/)

## Alternativa realmente pertinente: Capacitor para mobile

Capacitor merece permanecer como opção móvel porque pode ser adicionado a um projeto JavaScript moderno existente, cria containers iOS e Android e oferece plugins com implementações Swift, Java e Web. Ele complementa a PWA e o frontend React; não substitui Electron/Tauri como estratégia desktop geral. [Capacitor: documentação oficial](https://capacitorjs.com/docs) e [Capacitor: plataformas e integração](https://capacitorjs.com/)

Não há razão atual para escolher Capacitor: o simulador não apresentou requisito de loja ou API móvel indisponível na Web. Mantê-lo como shell possível — mediante uma interface de capacidades — é mais reversível do que instalar antecipadamente uma segunda toolchain nativa. Flutter, React Native e aplicações nativas não são alternativas equivalentes para esta decisão porque trocariam a camada de apresentação em vez de reutilizar diretamente o build HTML/CSS/JavaScript; podem ser reconsiderados somente se requisitos futuros mostrarem que a interface Web é insuficiente.

## Comparação para esta decisão

| Critério | PWA | Electron | Tauri 2 | Capacitor |
| --- | --- | --- | --- | --- |
| Reutiliza React/Vite | Diretamente | Como renderer | Como frontend em WebView | Como frontend em WebView |
| GitHub Pages | É a própria versão publicada | Convive com ela; binário separado | Convive com ela; pacote separado | Convive com ela; pacote separado |
| Windows/macOS/Linux | Instalação dependente do navegador/OS | Sim, foco principal | Sim | Não é sua proposta principal |
| Android/iOS | Sim, com diferenças de navegador/OS | Não | Sim, com paridade de plugins incompleta | Sim, foco principal |
| Offline | Service worker + armazenamento local, se projetados | Assets locais; persistência própria | Assets locais; persistência própria | Assets locais; persistência própria |
| Runtime visual | Navegador instalado | Chromium incluído | WebView do sistema | WebView do sistema |
| Atualização | Navegador/service worker | Updater/lojas; Linux por pacotes | Plugin/lojas, artefatos assinados | Lojas/processo nativo |
| Assinatura do projeto | Não para instalação pelo navegador | Praticamente necessária no desktop | Necessária na maioria das plataformas | Necessária para lojas móveis |
| Risco específico | suporte desigual e ciclo de cache | atualizações frequentes e maior superfície privilegiada | variabilidade do WebView e toolchain nativa | políticas de lojas e bridges/plugins |

As células da tabela resumem as fontes já citadas nas seções correspondentes; elas não atribuem uma garantia de longevidade a nenhum projeto.

## Requisitos arquiteturais reversíveis

Estes requisitos preparam a aplicação sem selecionar um empacotador:

1. **Um núcleo web canônico.** `vite build` deve produzir uma aplicação estática funcional sem Electron, Tauri ou Capacitor. Nenhum componente React importa APIs desses shells.
2. **Domínio puro e serializável.** Preservar Motor da máquina Braille, Documento Braille e Sessão de digitação como módulos TypeScript puros; efeitos entram por interfaces. Isso já é exigido pelas [ADRs 0001–0003](../adr/).
3. **Interface pequena de capacidades.** Definir adapters web para persistência, exportação/importação, áudio, ciclo de vida, informações da plataforma e, somente se necessário, atualizações. A interface expressa a capacidade do produto, não nomes como `electronAPI` ou `tauri`.
4. **Web como implementação padrão.** Usar primeiro APIs Web progressivamente aprimoradas e feature detection; ausência de uma capacidade precisa degradar de modo compreensível. Service workers, por exemplo, devem ser opcionais para o funcionamento básico, como recomenda o guia oficial. [web.dev: service workers](https://web.dev/learn/pwa/service-workers)
5. **Base URL única.** Assets, rotas, manifest e service worker derivam do `base` do Vite para funcionar tanto sob `/den-braille-typewriter/` quanto em origem/URL interna de um shell. [Vite: deploy estático](https://vite.dev/guide/static-deploy#github-pages)
6. **Dados independentes do cache.** Versionar o schema de Documento Braille e Preferências do simulador; separar migrações e persistência do cache de assets; oferecer exportação e restauração antes de prometer offline durável.
7. **Nenhuma dependência de rede no fluxo essencial.** Após o primeiro carregamento/instalação, digitação, revisão, áudio essencial e abertura de documentos devem ter comportamento offline definido. A interface deve comunicar claramente quando algo realmente depende da rede.
8. **Atualizações seguras.** Uma nova versão nunca deve misturar chunks/caches incompatíveis nem migrar dados sem recuperação. PWA precisa controlar o lifecycle do service worker; shells nativos precisarão artefatos assinados, política de rollout e rollback.
9. **Limite de privilégio.** Se surgir um shell, a UI continua não privilegiada. APIs nativas passam por bridge estreita, validada e testada; no Electron, renderer sandboxed, `contextIsolation`, CSP e sem Node direto. [Electron: segurança](https://www.electronjs.org/docs/latest/tutorial/security)
10. **Acessibilidade como gate por runtime.** Preservar HTML semântico e comportamento completo por teclado, mas testar o mesmo roteiro com tecnologias assistivas reais no navegador e em cada shell/sistema candidato. O fato de Electron e Tauri usarem conteúdo web não garante equivalência entre Chromium, WebView2, WKWebView e WebKitGTK. [Electron: acessibilidade](https://www.electronjs.org/docs/latest/tutorial/accessibility/) e [Tauri: WebViews](https://v2.tauri.app/reference/webview-versions/)
11. **Builds separados a partir da mesma versão.** Web/PWA e futuros shells consomem o mesmo frontend versionado, mas têm pipelines e artefatos próprios. Segredos de assinatura nunca entram no bundle web ou no repositório.
12. **Sem atualização de código remoto privilegiado.** Shells empacotam conteúdo local; atualizações trocam pacotes verificados, em vez de carregar a implantação corrente do Pages com privilégios nativos. Essa fronteira segue o modelo de ameaça documentado pelo Electron. [Electron: segurança](https://www.electronjs.org/docs/latest/tutorial/security)

## Decisão recomendada agora

1. Continuar a modernização para React/Vite e publicar o build estático no GitHub Pages.
2. Incluir na arquitetura os requisitos reversíveis acima, especialmente domínio puro, adapters, base URL e dados versionados.
3. Tratar **PWA como a primeira opção instalável**, adotada em uma etapa própria depois que offline, persistência, atualização e testes de acessibilidade tiverem critérios definidos.
4. Não adicionar Electron ou Tauri agora. Nenhum requisito atual demanda APIs privilegiadas ou distribuição por instalador, enquanto ambos acrescentam manutenção, segurança, assinatura e matriz de builds.
5. Quando houver demanda desktop concreta, fazer um protótipo comparativo de baixa fidelidade com Electron e Tauri usando exatamente o mesmo build React/Vite. O gate deve medir: NVDA/JAWS no Windows, VoiceOver no macOS, leitor de tela escolhido no Linux, acordes simultâneos, foco, áudio, tamanho/arranque, suporte mínimo de OS, pipeline assinada e atualização.
6. Quando houver demanda de loja móvel ou API nativa, comparar Capacitor e Tauri mobile contra a PWA já existente; não assumir que Electron participa dessa decisão.

Se a prioridade futura for previsibilidade do renderer desktop e histórico de adoção, Electron tende a ser o candidato inicial; se tamanho de distribuição, uma única família de shells desktop/mobile e uso do WebView do sistema pesarem mais, Tauri merece o teste. Isso é uma hipótese para o futuro, não uma escolha justificável hoje. A decisão durável é manter os shells substituíveis.

## Critérios para reabrir a escolha de empacotador

A comparação Electron/Tauri/Capacitor deve ser reaberta somente quando existir ao menos um requisito verificável que a PWA não satisfaça, como presença obrigatória em uma loja, acesso estável a uma API nativa, associação de arquivos, política institucional de instalação, atualização administrada ou suporte offline que o navegador-alvo não entregue. Nesse momento devem estar definidos sistemas e versões mínimos, canais de distribuição, orçamento/certificados de assinatura, política de atualizações e matriz de tecnologias assistivas. Sem esses dados, escolher um shell apenas cristaliza custos antes de esclarecer o problema.
