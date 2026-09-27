---
version: 1
slug: 'src-app-pages-braillerendererdemopage-tsx'
primary_target: 'src/app/pages/BrailleRendererDemoPage.tsx'
related_targets: []
---

# Demonstração visual de Impressões de cela

Modo: Operate. Público: pessoas que querem inspecionar a representação visual Braille, inclusive quem está aprendendo os estados de uma posição. A tarefa é comparar os estados existentes e mudar opções de apresentação sem iniciar uma Sessão de digitação. A rota será ligada pelo menu inicial. Não altera o Modo livre nem o Modo desafio.

## Direction contract

THESIS: Uma bancada de observação da Cela Braille, não uma terceira Experiência do simulador. A amostra editável e as amostras de referência mostram o renderer real em funcionamento.

OWN-WORLD: Papel branco, grafite, tipografia manual e contornos do caderno de prática existente. A cela tem sua própria geometria; o restante da página a enquadra sem fingir ser papel Braille físico.

STORY: A pessoa vê uma cela inicialmente ampliada a 2×, escolhe o estado de cada ponto e compara os resultados com espaço explícito, posição nunca utilizada e vestígio. Pode alternar estilo, numeração e escala, depois restaurar os padrões do renderer a 1×.

FIRST VIEWPORT: Retorno ao início e título curtos acima de uma bancada em duas regiões: a amostra ampliada domina a esquerda e controles rotulados ficam à direita. A comparação de estados começa logo abaixo, sem hero decorativo. A interação marcante é a troca imediata de estado de cada um dos seis pontos na própria amostra.

FORM: Extensão de escopo estreito, definida pela demonstração pedida e pelas escolhas de exemplos e controles interativos; concept-seed não se aplica (seed key: direct-narrow-request).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
