# Protótipo de Impressões de cela

## Iteração atual: estilos de apresentação

### Padrões aprovados e experimento seguinte

Padrão aprovado pelo mantenedor: Essencial sem contorno, números proporcionais e ampliação de 100%. O espaçamento anterior de 50% horizontal e 30% vertical foi renomeado para 100% do novo padrão: intervalos de 11,4 px entre celas e 13,41 px entre linhas, à escala 1. A mudança é de referência percentual, preservando as distâncias escolhidas. Restaurar espaçamento retorna a esses valores. A preferência positiva por monoespaçada na Moldura suave não altera a fonte padrão global.

Distâncias internas horizontal e vertical dos pontos agora podem ser experimentadas separadamente entre 80% e 150% do estilo. Não alteram diâmetro, pontos elevados ou vestígios; a área da cela acompanha a matriz para evitar sobreposição. Restaurar pontos retorna a 100% nos dois eixos. Valores assimétricos não preservam a geometria-base; esta configuração ainda está em avaliação, não é promessa de fidelidade física.

O mantenedor propôs famílias visuais, semelhantes à escolha de fontes, mantendo renderização HTML/CSS. O laboratório compara **Essencial**, preservando a apresentação sem contorno aprovada, e **Moldura suave**, um experimento com borda de 2 px, raio de 16 px, retângulo de 78 × 112 px, centros internos separados por 32 px e pontos grandes de 20 px. Valores são multiplicados pela ampliação. A geometria da Moldura suave é experimental, não uma afirmação de proporção normativa.

Apresentação didática e estilo são escolhas independentes. Espaçamento horizontal e vertical também é independente: controles de 0–200% multiplicam os intervalos iniciais de 22,8 e 44,7 px, sem alterar os pontos. A amostra tem duas linhas de oito celas. Trocar estilo ou espaçamento preserva o estado da impressão experimental. O nome definitivo do conceito e o desenho com moldura ainda aguardam validação; não se trata de arquivo de fonte.

As notas abaixo registram a evolução anterior do protótipo.

Executar na raiz: `npm run prototype`. Abrir http://localhost:3001/den-braille-typewriter/free?variant=B.

Artefato descartável de discussão, independente do build da aplicação. HTML/CSS nas apresentações comum (B) e didática (C), conforme orientação do mantenedor. A troca mantém o experimento em memória. Sem gravação de documentos.

O retângulo de 93 × 150 px centraliza uma matriz de seis posições. Centros separados por 35,1 px e pontos elevados de 21,6 px preservam a relação 2,34 / 1,44. Pontos inativos pequenos cinza, elevados grandes pretos e apagados grandes cinza. No modo didático todos são grandes, com números internos; elevados têm número branco. O cinza não representa ponto elevado. Descrição textual acompanha todos os estados.

Este laboratório usa a URL do Modo livre, servido por um servidor próprio sem dependências. Não implementa a Sessão de digitação. Avaliar centralização, estados e numeração com o mantenedor antes de resolver o ticket. Sem validação de tamanho físico, leitor de tela ou desempenho de grades extensas nesta etapa.

## Ajuste para comparação visual

A fonte proporcional foi escolhida pelo mantenedor por parecer mais natural no conjunto. O seletor monoespaçado permanece apenas como comparação no laboratório. O contorno experimental foi aproximado para 70,2 × 105,3 px, sem alterar os centros dos pontos. A nova linha demonstrativa usa passo horizontal de 93 px (6,2 unidades), independente do contorno. O contorno definitivo ainda está em avaliação.

Pontos apagados e inativos usam cinza claro `#ccc`, mantendo elevados em `#111`. A apresentação didática permite comparar fonte proporcional e monoespaçada apenas nos números. Contorno das celas opcional, inicialmente desligado; seleção e foco continuam visíveis. As opções não alteram a geometria ou o conteúdo. A paleta clara ainda precisa de avaliação de acessibilidade antes da implementação definitiva; não constitui aprovação de contraste.
