# Geometria e renderização visual de celas Braille

## Escopo

Esta pesquisa reúne evidências para o protótipo da representação visual de uma **Impressão de cela** no Simulador de máquina Braille. Ela separa três problemas que não devem ser confundidos:

- a geometria tátil normativa do Braille gravado em papel;
- uma geometria visual proporcional, que pode ser ampliada sem perder as relações entre os pontos;
- uma representação com tamanho físico calibrado, que depende do meio de saída.

O relatório não escolhe SVG, HTML/CSS ou Canvas e não define o design final. Essas decisões pertencem ao protótipo. As medidas abaixo descrevem Braille de seis pontos gravado em papel. Braille para sinalização possui requisitos diferentes.

## Síntese

| Tema | Evidência | Consequência para o protótipo |
| --- | --- | --- |
| Diâmetro nominal da base do ponto | 1,44 mm | Usar como diâmetro de referência do ponto elevado. |
| Distância entre centros dentro da cela | 2,34 mm, horizontal e vertical | Construir uma grade-base de duas colunas por três linhas. |
| Distância entre centros de celas adjacentes | 6,2 mm | Distinguir a geometria interna do passo horizontal da Grade Braille. |
| Distância entre linhas | 10 mm entre centros correspondentes | Distinguir a altura da cela do passo vertical da Grade Braille. |
| Altura nominal do relevo | 0,48 mm | Não converter em tamanho ou sombra visual como se houvesse equivalência tátil. |
| Tamanho físico em tela | Unidades CSS absolutas podem ser ancoradas no pixel de referência | Não prometer milímetros reais em tela sem calibração. |
| Tamanho físico impresso | CSS recomenda unidades físicas para mídia impressa | Oferecer um perfil de impressão separado e verificar com régua. |
| Fonte legada | Os arquivos não declaram licença nos metadados ou no repositório | Não os adotar como base do novo renderer; remover após o último consumidor. |

## Geometria normativa para papel

A especificação de produção de livros Braille da National Library Service (NLS), resumida pela Braille Authority of North America (BANA), define os seguintes valores nominais para Braille gravado em papel:

- altura do ponto: 0,019 polegada, ou 0,48 mm;
- diâmetro da base do ponto: 0,057 polegada, ou 1,44 mm;
- distância horizontal ou vertical entre centros de pontos adjacentes na mesma cela: 0,092 polegada, ou 2,34 mm;
- distância entre centros de pontos correspondentes de celas adjacentes: 0,245 polegada, ou 6,2 mm;
- distância entre centros de pontos correspondentes de linhas adjacentes: 0,400 polegada, ou 10 mm.

Esses são os valores nominais resumidos pela BANA. A Specification 800 da NLS também fornece tolerâncias de produção: +0,002/-0,001 polegada para altura, diâmetro e distância interna; e +0,005/-0,001 polegada para a distância entre celas. O protótipo visual não deve transformar essas tolerâncias de gravação tátil em escolhas de apresentação em tela. ([BANA — Size and Spacing of Braille Characters](https://www.brailleauthority.org/size-and-spacing-braille-characters); [NLS — Specification 800, seção 3.2](https://www.loc.gov/nls/wp-content/uploads/2019/09/Spec800.11October2014.final_.pdf))

A geometria interna de uma cela cheia ocupa 2,34 mm entre os centros das duas colunas e 4,68 mm entre os centros do primeiro e do terceiro ponto. O passo de 6,2 mm entre celas e o passo de 10 mm entre linhas são maiores: eles descrevem a Grade Braille, não o retângulo mínimo que envolve os seis pontos. A pesquisa já existente sobre a Perkins confirma que a máquina anuncia aproximadamente 6 mm entre celas e 10 mm entre linhas. ([Perkins Brailler Store — Features & Specs](https://brailler.perkins.org/pages/perkins-brailler); [Grade de papel da Perkins Brailler](./grade-de-papel-perkins-brailler.md))

O documento brasileiro _Grafia Braille para a Língua Portuguesa_ define a cela como o espaço ocupado por qualquer sinal, organiza seis pontos em duas colunas de três e identifica a cela vazia pelo numeral zero. Ele não fornece, no texto consultado, dimensões físicas para a cela. Portanto, ele sustenta a estrutura e a nomenclatura, enquanto as medidas devem vir de uma especificação de produção como a NLS. ([Ministério da Educação — Grafia Braille para a Língua Portuguesa, 3ª edição, itens 1 e 2](../Grafia%20Braille%20para%20a%20L%C3%ADngua%20Portuguesa.pdf))

## Modelo geométrico recomendado para o protótipo

O protótipo deve usar coordenadas normalizadas derivadas das medidas normativas, com um único fator de escala uniforme. Uma base simples em milímetros pode ser:

```text
centros das colunas: x = 0 e 2,34
centros das linhas:  y = 0, 2,34 e 4,68
diâmetro elevado:    1,44
passo entre celas:   6,20
passo entre linhas: 10,00
```

O renderer pode acrescentar margem visual ao redor dos centros, mas essa margem não deve mudar as proporções internas. O passo horizontal e o passo vertical pertencem ao layout da Grade Braille; não devem ser escondidos dentro do desenho de uma cela individual.

Uma ampliação uniforme preserva a geometria-base. Escalas horizontais e verticais independentes deformam a relação normativa. Elas podem existir como modo visual experimental ou recurso didático, mas não devem receber o nome de “proporção normativa”. O protótipo deve comparar ao menos:

1. proporção normativa com escala uniforme;
2. ampliação acessível uniforme;
3. modo didático com pontos inativos e numeração;
4. modo sem marcas inativas;
5. perfil de impressão em tamanho físico, separado da tela.

## Tela, zoom e tamanho físico

As unidades absolutas de CSS possuem relações fixas entre si: 1 polegada CSS equivale a 96 px e 25,4 mm CSS. Porém, a especificação permite que o navegador ancore essas unidades no pixel de referência, em vez de numa medida física real. Em telas, distância de observação, densidade de pixels, escala do sistema e zoom tornam `mm` uma unidade lógica, não uma garantia de milímetros medidos com régua. Para impressão e dispositivos de alta resolução, a âncora física é a expectativa normativa. ([W3C — CSS Values and Units Level 4, absolute lengths](https://www.w3.org/TR/css-values-4/#absolute-lengths); [W3C — CSS units](https://www.w3.org/Style/Examples/007/units.en.html))

Assim, o produto deve usar linguagem precisa:

- **proporção normativa**: relações geométricas preservadas, qualquer que seja a escala;
- **tamanho visual equivalente**: escala de referência sem garantia física;
- **tamanho calibrado**: resultado ajustado pela pessoa contra uma medida conhecida no dispositivo;
- **tamanho de impressão**: saída em unidades físicas, validada no fluxo de impressão.

Se houver calibração, ela deve mostrar uma referência mensurável, guardar o fator por dispositivo e permitir restaurar o padrão. O zoom do navegador e as preferências de ampliação devem continuar funcionando; uma calibração não pode bloquear redimensionamento acessível.

## Representação dos estados do domínio

O renderer deve receber uma Impressão de cela ou um estado explícito da posição, não um caractere textual. A apresentação precisa conseguir distinguir, conforme o contexto:

- posição nunca utilizada;
- Impressão de cela vazia, que registra espaço produzido;
- pontos elevados;
- pontos inativos usados apenas como apoio visual;
- vestígios de Apagamento físico;
- Posição de edição e Posição de revisão, sem incorporá-las à Cela Braille.

Uma cela vazia não pode depender de um glifo de espaço. No modo inspirado na fonte legada, ela pode mostrar seis marcas finas; em outro modo, pode mostrar o contorno da posição ou nenhum ponto. A diferença entre espaço explícito e posição nunca utilizada precisa continuar disponível por semântica, estilo adicional ou ambos.

Cor, tamanho ou espessura não podem ser a única forma de comunicar um estado. A representação visual é uma projeção; a UI ainda deve fornecer nome e descrição acessíveis da posição e dos pontos. SVG admite nomes e descrições acessíveis e mapeamento por WAI-ARIA, mas isso não torna cada círculo automaticamente semântico. ([W3C — Accessibility Support in SVG 2](https://www.w3.org/TR/SVG/access); [W3C — SVG Accessibility API Mappings 1.0](https://www.w3.org/TR/svg-aam-1.0/))

A WCAG 2.2 também impede que cor seja o único meio de distinguir informação, exige contraste mínimo de 3:1 para partes gráficas necessárias e requer que o conteúdo suporte ampliação de texto e refluxo, ressalvado o conteúdo cujo uso exige layout bidimensional. O protótipo deve verificar marcadores ativos e inativos, zoom e navegação da grade contra esses critérios, sem presumir que a exceção de layout bidimensional elimina a necessidade de alternativas acessíveis. ([W3C — WCAG 2.2, critérios 1.4.1, 1.4.4, 1.4.10 e 1.4.11](https://www.w3.org/TR/WCAG22/#distinguishable))

Para uma Grade Braille extensa, expor seis nós acessíveis por cela pode produzir uma árvore excessiva. O protótipo deve comparar uma descrição semântica por posição, por exemplo “linha 2, coluna 4, pontos 1 e 3”, com detalhamento sob demanda. Isso preserva a Impressão de cela como unidade examinável sem fazer da primitiva gráfica a fonte do significado.

## Tecnologias a comparar

### SVG

SVG é o candidato inicial mais forte para uma cela ou pequenos grupos. Ele oferece coordenadas explícitas, círculos vetoriais, escala uniforme, estilos por estado e alternativas textuais. Também permite reutilizar a mesma geometria em exemplos, materiais didáticos e impressão. A acessibilidade deve ser fornecida pelo componente e testada, não presumida pela escolha de SVG.

### HTML e CSS

Uma grade de seis elementos HTML pode expressar os pontos sem uma dependência gráfica adicional. É simples de estilizar e pode funcionar bem para uma cela. O protótipo deve medir se arredondamento, alinhamento subpixel e grande quantidade de elementos continuam estáveis numa Grade Braille extensa.

### Canvas

Canvas pode reduzir o número de nós visuais numa Grade Braille grande, mas seu bitmap não oferece por si só uma estrutura acessível equivalente aos objetos desenhados. Se for testado, precisa de uma camada semântica HTML sincronizada e de estratégia para densidade de pixels, zoom e impressão. Por isso, não é o candidato inicial para a unidade interativa examinável.

O protótipo deve começar por SVG e HTML/CSS. Canvas só deve avançar se uma medição com grades representativas demonstrar um problema real de desempenho.

## Fontes legadas e licenciamento

O repositório contém `Braille-ASCII.ttf`, `borthick's-braille.ttf` e `braille_v1_by_xchristaox.ttf`. Somente o último é referenciado pelo `@font-face`, sob o nome local `Braille ASCII`. Seus metadados legíveis atribuem a fonte a Steven Borthick, em 2006, e declaram “All Rights Reserved”, mas não incluem licença de modificação ou redistribuição. O histórico local registra a inclusão do arquivo ativo, sem licença própria.

A dissertação do projeto documenta que o arquivo ativo é uma versão de “Borthick's Braille” modificada para adicionar e remapear caracteres da grafia portuguesa. Ela registra a origem e a transformação, mas não uma autorização. Catálogos de fontes de terceiros divergem ou são vagos sobre permissão e não são evidência suficiente para conceder uma licença. A licença MIT na raiz do repositório também não pode relicenciar uma obra de terceiro. Sem autorização rastreável, o projeto não deve assumir que pode modificar ou redistribuir essas fontes. ([Dissertação do projeto — implementação da fonte](../tmdei-dissertation/ch06/chapter06.tex))

Antes de remover os arquivos, deve-se registrar no histórico do projeto:

- hashes dos arquivos;
- metadados extraídos;
- commit de introdução;
- procedência conhecida fornecida pelo mantenedor;
- ausência atual de uma licença verificável.

Os hashes SHA-256 observados nesta pesquisa são:

```text
d00ab79edec34ca4f852d172269cda1a27337192bc43cc75be68147b1b6936e3  Braille-ASCII.ttf
5c79f61b080cb9c1fd2055e8127a33d7fa7ab29b6a83ec59f6fbe0e252f9bce4  borthick's-braille.ttf
ad623644e5cd5441dc8f6d973b4d5a90a9a631b7e5a7d24bd12352c4420935bc  braille_v1_by_xchristaox.ttf
```

A remoção deve ocorrer somente depois que nenhum consumidor permanecer. Se algum arquivo precisar continuar distribuído, a licença deve ser esclarecida primeiro com a pessoa autora ou uma fonte oficial.

## Critérios recomendados para o protótipo

O ticket de protótipo deve produzir evidência suficiente para decidir:

- se SVG ou HTML/CSS será a primitiva visual padrão;
- como a geometria-base será expressa e escalada uniformemente;
- como espaço explícito, posição nunca utilizada, pontos inativos e vestígios serão diferenciados;
- quais modos visuais são úteis sem duplicar o modelo de domínio;
- como uma descrição acessível por Impressão de cela será exposta;
- qual tamanho de Grade Braille mantém desempenho e navegação aceitáveis;
- como impressão e eventual calibração serão testadas;
- como temas mantêm contraste sem usar cor como único sinal.

O protótipo deve verificar as medidas com testes de geometria, capturas em pelo menos duas escalas, zoom do navegador, alto contraste ou cores forçadas, impressão para PDF e uma folha impressa medida com régua. Também deve registrar navegador, sistema, escala do sistema e nível de zoom usados em cada evidência.

## Conclusão

A geometria normativa fornece uma base forte, mas não determina uma única apresentação visual. A aplicação deve desenhar a Impressão de cela a partir de dados do domínio, preservar as proporções de 1,44 / 2,34 / 6,2 / 10 mm numa escala uniforme e oferecer modos de apresentação sem depender de uma fonte. SVG deve ser o primeiro candidato do protótipo, com HTML/CSS como comparação e Canvas condicionado a evidência de desempenho.

O produto não deve afirmar que uma cela tem tamanho físico real numa tela comum. Essa afirmação só é defensável num perfil calibrado ou numa saída impressa verificada. As fontes atuais têm procedência e licença insuficientemente documentadas e não devem continuar como fundação da nova UI.

## Fontes primárias

- [BANA — Size and Spacing of Braille Characters](https://www.brailleauthority.org/size-and-spacing-braille-characters)
- [National Library Service — Specification 800](https://www.loc.gov/nls/wp-content/uploads/2019/09/Spec800.11October2014.final_.pdf)
- [Perkins Brailler Store — Perkins Brailler, Features & Specs](https://brailler.perkins.org/pages/perkins-brailler)
- [Ministério da Educação — Grafia Braille para a Língua Portuguesa, 3ª edição](../Grafia%20Braille%20para%20a%20L%C3%ADngua%20Portuguesa.pdf)
- [W3C — CSS Values and Units Level 4](https://www.w3.org/TR/css-values-4/)
- [W3C — CSS units](https://www.w3.org/Style/Examples/007/units.en.html)
- [W3C — Accessibility Support in SVG 2](https://www.w3.org/TR/SVG/access)
- [W3C — SVG Accessibility API Mappings 1.0](https://www.w3.org/TR/svg-aam-1.0/)
- [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
