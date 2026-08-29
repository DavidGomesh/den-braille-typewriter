# Testes por interfaces e guardrails contínuos

A modernização será protegida por testes orientados às interfaces dos novos módulos e por guardrails automatizados na integração. A implementação antiga não define o comportamento correto: ADRs, regras de domínio, critérios aprovados e normas aplicáveis orientam os testes. Testes de caracterização do código antigo serão excepcionais e temporários, somente para preservar jornadas necessárias enquanto uma capacidade é substituída.

## Consequências

- Cada capacidade nova terá exemplos e invariantes definidos antes de ser conectada ao produto. Não se exige TDD rígido em cada linha, mas nenhum módulo novo entra numa jornada sem testes de sua interface.
- Módulos puros, como Motor, Sessão de digitação, Grafia Braille, Experiências do simulador e coordenador de Feedback multimodal, serão exercitados por entradas e resultados observáveis na interface, sem acoplamento aos detalhes da implementação.
- Adapters que ocupam a mesma seam executarão uma suíte de contrato compartilhada para suas obrigações comuns e testes adicionais para as particularidades de cada ambiente.
- Relógio, sorteio, armazenamento, áudio e recursos do navegador entrarão por interfaces explícitas quando variarem. Os testes usarão adapters determinísticos em vez de depender de tempo, aleatoriedade ou efeitos reais.
- A estratégia combinará muitos testes rápidos de módulos puros, testes de contrato por seam, testes de integração entre capacidades e poucas jornadas completas no navegador. Procedimentos manuais complementarão a automação quando o resultado exigir julgamento humano.
- Testes de módulos e contratos ficarão próximos ao código protegido. Jornadas automatizadas e procedimentos manuais terão áreas próprias.
- Snapshots extensos da UI serão evitados. Snapshots pequenos poderão proteger estruturas estáveis quando forem mais claros que expectativas individuais.
- Relatórios de cobertura orientarão a descoberta de lacunas, mas uma porcentagem global não será usada como prova de qualidade. Comportamentos alterados, contratos públicos e invariantes críticos precisam de cobertura adequada ao risco.
- Toda mudança passará por instalação reproduzível pelo lockfile, verificação de formatação, lint, typecheck sem emissão, testes automatizados e build de produção. As verificações não alterarão arquivos silenciosamente.
- Testes rápidos, contratos e build executarão em cada mudança; jornadas automatizadas executarão conforme o impacto; a matriz ampliada, procedimentos manuais e testes com tecnologias assistivas e pessoas executarão em ciclos programados ou lançamentos.
- Vulnerabilidades críticas ou altas que afetem dependências executadas em produção bloquearão a integração. Riscos antigos serão tratados separadamente durante a modernização, mas mudanças não poderão introduzir riscos equivalentes.
- Testes instáveis serão corrigidos ou isolados com pessoa responsável e prazo. Repetir até passar não será solução aceita.
- Procedimentos manuais registrarão preparação, ambiente e versões, passos, resultado esperado, aspectos a observar e evidências. Serão classificados por capacidade, jornada, critério de acessibilidade e ambiente necessário.
- O repositório versionará os procedimentos e modelos de relatório. Evidências de cada execução ficarão ligadas à mudança ou ao lançamento.
- Correções acrescentarão testes automatizados de regressão quando o defeito puder ser reproduzido numa interface estável. Caso contrário, atualizarão um procedimento manual e registrarão a justificativa.
- Exceções aos guardrails exigirão motivo, risco, aprovação humana e trabalho de correção associado. Não haverá bypass silencioso ou desativação permanente.
- Testes provisórios serão removidos com a implementação antiga. Os testes permanentes permanecerão associados à nova interface e às jornadas do produto.
