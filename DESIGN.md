---
name: Máquina Den Braille
description: Interface atual do simulador educacional de máquina Braille
colors:
    graphite: '#333333'
    graphite-muted: '#555555'
    ink: '#212529'
    paper: '#ffffff'
    paper-soft: '#f7f7f9'
    rule: '#dee2e6'
typography:
    display:
        fontFamily: 'Cabin Sketch, cursive'
        fontSize: 5rem
        fontWeight: 500
        lineHeight: 1.2
    headline:
        fontFamily: 'Neucha, system-ui, sans-serif'
        fontSize: 2.5rem
        fontWeight: 700
        lineHeight: 1.5
    body:
        fontFamily: 'Neucha, system-ui, sans-serif'
        fontSize: 1rem
        fontWeight: 700
        lineHeight: 1.5
    label:
        fontFamily: 'Neucha, system-ui, sans-serif'
        fontSize: 1.25rem
        fontWeight: 700
        lineHeight: 1.5
rounded:
    sm: 15px
    md: 25px
    lg: 35px
    button-large: '55px 225px 15px 25px / 25px 25px 35px 355px'
    key-dot: 50%
    key-space: 50rem
    key-control: 1rem
spacing:
    xs: 0.25rem
    sm: 0.5rem
    md: 1rem
    xl: 3rem
components:
    menu-link:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.graphite}'
        typography: '{typography.label}'
        rounded: '{rounded.button-large}'
        padding: '0.5rem 1rem'
        width: 300px
    menu-link-hover:
        backgroundColor: '{colors.graphite}'
        textColor: '{colors.paper}'
        rounded: '{rounded.button-large}'
    output-field:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink}'
        rounded: '{rounded.button-large}'
        padding: 3rem
        height: 400px
    keyboard-dot:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink}'
        rounded: '{rounded.key-dot}'
        size: 75px
    keyboard-space:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink}'
        rounded: '{rounded.key-space}'
        width: 145px
        height: 75px
---

# Design System: Máquina Den Braille

## Overview

**Creative North Star: "Caderno de prática"**

A interface atual é didática e informal. Fundo branco, texto em grafite, letras com aparência manuscrita e bordas levemente irregulares lembram uma página de exercícios. A composição é espaçosa: poucas ações aparecem de cada vez, e a área de produção Braille ocupa a maior parte do Modo livre e do Modo desafio.

Essa identidade vem do Bootswatch Sketchy versionado em `src/vendors/bootstrap/css/bootstrap.min.css`, com ajustes locais. É a linguagem visível nas telas atuais, não uma aprovação de todos os limites herdados de layout ou acessibilidade. O renderer HTML/CSS de Impressões de cela está em uma branch de funcionalidade separada; ainda não integra esta branch nem as páginas e possui geometria própria.

**Key Characteristics:**

- Papel branco e grafite, com cor usada sobretudo para indicar estado.
- Tipografia de esboço em títulos e manuscrita no texto de interface.
- Contornos irregulares em ações e área de escrita; teclas da máquina com formas reconhecíveis.
- Composição centrada na tarefa de produzir Braille.

## Colors

A paleta observada é papel branco e grafite, com cinzas para hierarquia e limites. O tema contém outras cores semânticas do Bootstrap, mas elas não definem as telas observadas.

### Primary

- **Grafite** (`#333333`): contorno e texto dos links de ação; preenchimento no estado de destaque.
- **Grafite secundário** (`#555555`): contorno das teclas visuais e texto menos proeminente.

### Neutral

- **Papel branco** (`#ffffff`): fundo da aplicação e da área de escrita.
- **Tinta** (`#212529`): texto corrente do corpo.
- **Papel suave** (`#f7f7f9`): superfície neutra disponível no tema, sem protagonismo nas telas atuais.
- **Linha discreta** (`#dee2e6`): limite neutro do tema; os controles principais usam o Grafite de 2 px.

**The Papel e Grafite Rule.** A ação e o conteúdo se distinguem por texto, preenchimento e contorno; não atribua significado somente à cor.

## Typography

**Display Font:** Cabin Sketch, com fallback cursivo.

**Body Font:** Neucha, com fallback de sistema sem serifa.

**Character:** O título tem traço de esboço; instruções e rótulos parecem escritos à mão. As fontes são carregadas pelo tema; se falharem, os fallbacks mudam perceptivelmente a aparência.

### Hierarchy

- **Display** (500, `5rem`, `1.2`): título da página inicial.
- **Headline** (700, `2.5rem`, `1.5`): nome dos modos nas telas de digitação, usando Neucha.
- **Body** (700, `1rem`, `1.5`): instruções, estados e conteúdo de interface.
- **Label** (700, `1.25rem`, `1.5`): links grandes do menu; as teclas usam corpo menor.

A visualização Braille legada do campo de saída usa a fonte local Braille ASCII com `4rem` e espaçamento entre letras de `15px`. Ela pertence ao caminho atual da apresentação e não é um token tipográfico para o novo renderer HTML/CSS.

## Layout

A página inicial centraliza título e duas ações empilhadas. Modo livre e Modo desafio centralizam título, instruções, área de produção e representação do teclado em uma coluna. O conteúdo usa o contêiner Bootstrap, que chega a `1320px` em telas largas. A área de saída tem altura fixa de `400px` e `3rem` de preenchimento; as teclas de ponto medem `75 × 75px`, enquanto a de espaço mede `145 × 75px`.

As páginas atuais usam regiões com `100vh` e uma linha de instruções extensa. Esses valores descrevem a implementação observada, mas não são regra para novas telas: zoom e refluxo devem continuar obedecendo aos requisitos de acessibilidade do produto.

## Elevation & Depth

A profundidade é plana, definida por contornos. Os links do menu, a área de escrita e as teclas não têm sombra em repouso. O tema dispõe de sombras Bootstrap, mas elas não aparecem como linguagem central nas telas observadas. O foco dos campos pode usar um anel de `0 0 0 0.25rem rgba(51, 51, 51, 0.25)`.

**The Contorno Primeiro Rule.** Use o traço para delimitar superfícies e ações; não adicione elevação onde o desenho atual é plano.

## Shapes

Botões grandes e campos usam curvas assimétricas do Sketchy (`55px 225px 15px 25px / 25px 25px 35px 355px`). A borda principal tem `2px`. Os seis controles de ponto da representação do teclado são círculos de `75px`; espaço é uma cápsula larga; Enter e Retrocesso usam cantos arredondados. As irregularidades dão o aspecto manual sem esconder a função de cada controle.

## Components

**Traços manuais e ação clara** descreve os padrões que estão em uso. Os exemplos reutilizáveis no painel Impeccable ficam em `.impeccable/design.json`.

### Links de menu

São links com aparência de botão, largura de `300px`, fundo branco, texto e borda Grafite de `2px`, rótulo forte e contorno assimétrico. Ao passar o ponteiro ou focar, o tema inverte fundo e texto e acrescenta indicação de foco.

### Área de produção

É um `textarea` amplo com fundo branco, contorno Grafite de `2px`, curva assimétrica, altura de `400px` e preenchimento de `3rem`. No Modo livre atual é somente leitura; no Modo desafio legado recebe entrada. A fonte Braille ASCII aparece quando a preferência de visualização está em Braille.

### Teclado visual

Os pontos são círculos contornados; espaço é uma cápsula; Enter e Retrocesso são retângulos arredondados. O preenchimento escuro indica tecla pressionada. São representações do estado da máquina, não seis controles de interface independentes.

### Impressão de cela nova

O componente em desenvolvimento numa branch de funcionalidade desenha pontos elevados, inativos e vestígios em HTML/CSS. Seu estilo Essencial é o padrão e Moldura suave é alternativa. Ele ainda não está nesta branch nem é visível nas telas da aplicação.

## Do's and Don'ts

### Do:

- **Do** manter texto e contornos legíveis sobre papel branco, usando os valores observados como ponto de partida.
- **Do** preservar nomes, estados, foco e ordem semântica ao compor novas telas.
- **Do** tratar a área de produção como centro da tarefa e manter instruções próximas da ação correspondente.

### Don't:

- **Don't** usar a fonte Braille ASCII como base de novos componentes de Impressão de cela.
- **Don't** tratar os tokens disponíveis no Bootstrap como padrões visuais já adotados pela aplicação.
- **Don't** reproduzir alturas fixas ou linhas sem refluxo quando impedirem zoom, leitura ou operação por teclado.
