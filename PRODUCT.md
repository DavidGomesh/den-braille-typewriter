# Produto

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

O público prioritário é formado por pessoas que estão aprendendo Braille e querem aprender e praticar a digitação. O simulador também atende pessoas que já praticam Braille. A experiência deve servir a pessoas videntes, cegas e com baixa visão.

## Product Purpose

O Simulador de máquina Braille reproduz digitalmente a interação com uma máquina Braille para aprendizagem e prática. A pessoa deve conseguir produzir, examinar e corrigir sua produção Braille em uma atividade compreensível e acessível.

## Positioning

A prática é organizada em torno de controles e operações de uma máquina Braille: acordes de pontos produzem Impressões de cela em um Documento Braille. O documento preserva a produção independentemente de sua interpretação textual, apresentação visual ou sonora.

## Operating Context

- Aplicação web usada atualmente em navegador desktop com teclado físico.
- Modo livre para criar e editar Documentos Braille sem objetivo imposto; Modo desafio para responder a uma proposta guiada.
- Produção, revisão e correção podem ser acompanhadas por apresentação visual, semântica acessível e feedback falado ou sonoro opcional.
- A aplicação está em modernização incremental; partes da apresentação ainda usam o caminho legado.

## Capabilities and Constraints

- O Documento Braille é a fonte de verdade da produção. A interpretação textual é derivada e contextual.
- O renderer HTML/CSS de Impressões de cela está em desenvolvimento numa branch de funcionalidade; ainda não integra esta branch nem as páginas da aplicação.
- Preferências do simulador persistem entre Sessões de digitação; Requisitos da experiência podem substituí-las temporariamente sem alterar as escolhas permanentes.
- A captura de acordes por teclado físico pertence a uma região focada e identificável. Toque e ponteiro não fazem parte da entrada Braille modernizada atual.
- O GitHub Pages é o destino web atual; a arquitetura não depende dele para as regras do produto.

## Brand Commitments

O nome exibido na aplicação é “Máquina Den Braille”. A documentação e os textos dirigidos às pessoas usam português; identificadores e contratos técnicos usam inglês.

## Evidence on Hand

- [Vocabulário do domínio](CONTEXT.md) e [arquitetura vigente](docs/architecture/README.md).
- [Pesquisa de geometria Braille](docs/research/geometria-e-renderizacao-visual-braille.md).
- Código, testes e recursos de áudio versionados no repositório. O protótipo visual aprovado permanece em branch própria como referência, não como código integrado.

## Product Principles

1. Ensinar e permitir prática sem transformar o significado textual em fonte da produção Braille.
2. Preservar o mesmo fato semântico entre apresentação visual, acessível e falada.
3. Permitir que a pessoa controle a captura de teclado e o áudio do aplicativo.
4. Evoluir a interface sem interromper as jornadas essenciais já disponíveis.

## Accessibility & Inclusion

O projeto adota WCAG 2.2 AA e ABNT NBR 17225:2025 como piso de avaliação, sem declarar conformidade antes de uma avaliação completa. As jornadas críticas devem funcionar sem visão e com áudio do aplicativo desligado; a semântica do navegador deve atender leitores de tela e linhas Braille atualizáveis. Zoom, refluxo, contraste, cores forçadas, foco e operação por teclado fazem parte das verificações aplicáveis.
