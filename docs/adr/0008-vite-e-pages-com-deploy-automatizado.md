# Vite e GitHub Pages com deploy automatizado

A plataforma web migrará de Create React App para Vite em etapas verificáveis, continuará publicada no GitHub Pages e usará GitHub Actions para CI e deploy. A hospedagem será tratada como um adapter operacional: base, roteamento e assets terão configuração concentrada, sem entrar nos módulos do domínio nem acoplar permanentemente a aplicação ao Pages.

## Consequências

- A adoção ocorrerá em dimensões separadas: fixar Node.js 24 e os comandos atuais; produzir um build Vite equivalente; migrar HTML, ponto de entrada, assets e base; automatizar CI e deploy; remover `react-scripts` e `gh-pages`; migrar Jest para Vitest; atualizar React; e adotar TypeScript 6 estrito antes da reorganização estrutural.
- Vite e CRA poderão coexistir somente durante uma validação curta. O fluxo antigo permanecerá recuperável até o corte e deixará de receber mudanças depois do primeiro deploy Vite validado.
- O projeto manterá npm e `package-lock.json`. CI e releases instalarão com `npm ci`; intervalos compatíveis ficarão no `package.json` e as versões exatas no lockfile.
- A interface operacional do projeto terá comandos estáveis para desenvolvimento, build, testes, jornadas em navegador, typecheck, lint e verificação de formatação. Automações chamarão esses comandos, não as ferramentas internas diretamente.
- Um workflow de CI verificará pull requests e `main`; um workflow separado publicará somente um estado verde de `main`, com permissões mínimas e concorrência que descarte publicações obsoletas.
- O deploy produzirá `dist/`, usará o mecanismo oficial de artefatos do GitHub Pages e ficará ligado ao commit exato. Rollback republicará um commit conhecido como estável, sem edição manual da branch de publicação.
- Enquanto o Pages não oferecer fallback de SPA, a UI usará roteamento com hash. Rotas inválidas após o hash apresentarão uma página de rota não encontrada; caminhos inválidos enviados ao servidor receberão um `404.html` estático e acessível, sem redirecionamento artificial.
- Páginas de erro, configurações e suporte não são Experiências do simulador. A estratégia do router ficará na composição da UI e poderá mudar sem afetar os módulos do produto.
- Base de publicação, router, manifest e assets derivarão de uma configuração única. Assets estáticos conhecidos serão importados; assets públicos escolhidos por catálogo usarão uma interface central para resolver URLs. Módulos do domínio não conhecerão caminhos ou URLs.
- React passará por 18.3 antes de 19.2. TypeScript 6 usará `strict`; exceções temporárias serão locais, justificadas, verificáveis e rastreáveis.
- Dependências serão revisadas por função antes de atualizadas: remover as substituídas ou sem uso, manter temporariamente o que preservar uma jornada, substituir acoplamentos inadequados e atualizar somente o que permanecer.
- Dependabot poderá propor mudanças pequenas ou grupos compatíveis, mas nunca integrar sem guardrails. Compatibilidade legada do Vite somente será adicionada quando a matriz suportada demonstrar necessidade.
- Configurações incluídas no frontend serão públicas. Segredos de deploy ficarão no GitHub Environment e nunca entrarão no bundle ou no repositório.
- Não será contratada outra hospedagem apenas para previews nesta etapa. Build, relatórios, Playwright, execução local e artefatos da CI sustentarão a revisão.
- PWA, service worker e cache offline não farão parte da troca inicial de build; exigirão uma etapa posterior com critérios de persistência, recuperação, atualização e acessibilidade.
- O CRA somente será removido quando desenvolvimento, guardrails, rotas, assets, jornadas disponíveis, build, deploy e rollback estiverem verificados. A etapa termina com a remoção das dependências obsoletas e uma auditoria sem novas vulnerabilidades críticas ou altas de produção sem exceção formal.
