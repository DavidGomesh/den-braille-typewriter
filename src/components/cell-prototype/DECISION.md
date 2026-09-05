## Resolução aprovada pelo mantenedor

Modelo visual aprovado após iterações e experimentação no Chrome.

- Renderização em HTML/CSS, sem fonte Braille ou SVG.
- Estilos de apresentação: **Essencial** sem contorno como padrão e **Moldura suave** como alternativa, com geometria visual própria. Novos estilos ficam para evolução futura.
- Pontos elevados grandes e pretos; inativos pequenos cinza-claro; vestígios de Apagamento físico grandes cinza-claro. Espaço produzido mostra seis pontos inativos; posição nunca utilizada continua distinta e sem impressão.
- Apresentação didática opcional: círculos grandes com números internos, contornos nos inativos, número branco no elevado preto. Fonte proporcional por padrão; monoespaçada disponível como alternativa.
- Ampliação inicial 100%. Os antigos 50% entre celas e 30% entre linhas tornam-se 100% da nova referência: intervalos de 11,4 px e 13,41 px na escala 1 do protótipo.
- Distâncias entre celas, linhas e pontos (horizontal e vertical) configuráveis separadamente, com restauração dos padrões. A caixa acompanha os pontos para evitar sobreposição. Essas preferências não alteram o Documento Braille.
- A geometria-base é uma referência visual escalável. Estilos e ajustes assimétricos não prometem proporção normativa nem milímetros físicos em telas.

### Interface para a implementação

O módulo visual em ui recebe o estado da posição (nunca utilizada ou Impressão de cela com pontos elevados e apagados), o estilo e as opções de apresentação. Não recebe Sessão de digitação, Experiência do simulador, áudio ou regras de interpretação. O layout da Grade Braille aplica os intervalos entre celas e linhas. A camada que compõe a apresentação fornece coordenadas, seleção, foco e ações; o desenho dos pontos não é a fonte do significado.

Cada impressão deve ter descrição textual acessível dos pontos elevados e vestígios; espaço explícito e posição nunca utilizada são descritos separadamente. Exemplo isolado e conteúdo didático podem usar a mesma apresentação. Na grade, a semântica e navegação pertencem à composição da grade, evitando seis itens acessíveis por impressão quando os pontos não forem controles.

### Evidência e limites

Protótipo preservado na branch [prototype/celas-html-css](https://github.com/DavidGomesh/den-braille-typewriter/tree/prototype/celas-html-css/src/components/cell-prototype), executável com npm run prototype. Foram verificados no Chrome a apresentação, mudanças de estado, troca de estilos, controles de espaçamento e restauração; o mantenedor aprovou o resultado.

A alternativa sem marcas inativas foi experimentada e não escolhida para o conjunto inicial. O protótipo é fonte de referência, não implementação pronta. A paleta clara aprovada visualmente ainda deve passar pelo contrato arquitetural de acessibilidade: contraste, cores forçadas, zoom, leitores de tela e desempenho em grades extensas precisam ser verificados na implementação. Não se declara conformidade a partir desta avaliação visual; se necessário, adaptar a apresentação acessível sem perder a distinção semântica.

Esta conclusão encerra a decisão de apresentação; não encerra a implementação futura da modernização.
