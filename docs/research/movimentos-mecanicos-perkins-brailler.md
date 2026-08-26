# Movimentos mecânicos da Perkins Brailler

## Escopo

Esta pesquisa verifica quais movimentos de carro e papel são documentados para máquinas Braille mecânicas de seis pontos, com foco na Perkins Brailler clássica e em variantes oficiais da mesma plataforma. Também verifica como os fabricantes documentam o apagamento de pontos.

O relatório descreve somente capacidades físicas e limitações encontradas nas fontes. Ele não define políticas para o Simulador de máquina Braille.

## Resumo dos achados

| Movimento ou correção | Capacidade documentada | Limite relevante |
| --- | --- | --- |
| Retroceder uma cela | Sim. A tecla de retrocesso move o carro uma cela para a esquerda. | O movimento não apaga nem modifica os pontos já gravados. |
| Avançar sem marcar | Sim. A barra de espaço move o carro para a direita, cela por cela. | O carro também pode ser liberado e deslocado manualmente por várias celas. |
| Ir para a próxima linha | Sim. A tecla de espaçamento de linha avança o papel; o carro deve ser levado separadamente à margem esquerda. | Mover o carro à esquerda antes de avançar a linha pode danificar pontos já gravados, segundo o manual da SMART Brailler. |
| Retornar a uma linha anterior | Mecanicamente, sim: os botões de alimentação movem o papel nos dois sentidos. | Não há um comando de “linha anterior” equivalente à tecla de espaçamento de linha. O movimento pelos botões pode causar perda progressiva de alinhamento. |
| Retornar com alinhamento preciso | Não há garantia de alinhamento exato para movimentos repetidos. | Os manuais alertam para o *creep*, deslocamento que deixa novas celas mais altas ou mais baixas que as existentes. |
| Apagar pontos | Sim. O apagador achata pontos elevados; há ferramentas para uma cela inteira ou para um ponto individual. | Um ponto achatado pode voltar a subir se a posição receber nova gravação. |

## Movimento horizontal do carro

O manual oficial da Perkins Brailler identifica nove controles: seis controles de pontos, barra de espaço, espaçamento de linha e retrocesso. O carro conduz a cabeça de gravação da esquerda para a direita. A barra de espaço move o carro para a direita e a alavanca do carro pode ser pressionada para liberar seu deslocamento manual até qualquer posição da linha. ([Perkins School for the Blind — manual da Perkins Brailler, pp. 5–6](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf))

A documentação da APH SMART Brailler, que mantém as funções mecânicas da plataforma Perkins mesmo sem energia, torna a granularidade explícita: a barra de espaço move o carro uma cela por vez; o botão de liberação permite deslocá-lo manualmente por várias celas. Cada liberação dos controles de pontos também avança o carro uma cela. ([APH — SMART Brailler Manual, “Keys” e “Carriage”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html))

O retrocesso move o carro para a esquerda. Os manuais não descrevem esse controle como apagamento. Ao explicar uma correção, o manual da SMART Brailler manda usar o retrocesso até posicionar a cabeça de gravação sobre a cela e só então acrescentar os pontos ausentes; isso confirma que o conteúdo físico anterior permanece no papel. ([APH — SMART Brailler Manual, “Correcting Brailling Errors”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html))

## Movimento vertical do papel

A tecla de espaçamento de linha move o papel para a próxima linha. Ela não retorna o carro à margem esquerda: ao terminar uma linha, o procedimento documentado é primeiro acionar o espaçamento de linha e depois mover o carro à margem esquerda. O manual da SMART Brailler adverte que mover o carro para a esquerda antes de avançar a linha pode danificar os pontos já produzidos. ([Perkins School for the Blind — manual da Perkins Brailler, p. 12](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf); [APH — SMART Brailler Manual, “Brailling Tips”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html))

Os botões de alimentação controlam os rolos e movem o papel para dentro e para fora da máquina. O manual da SMART Brailler documenta que girar os botões em direção à pessoa move o papel para trás e produz um clique a cada linha. O sentido inverso é usado para fazer o papel sair da máquina. Portanto, existe capacidade mecânica de retornar verticalmente pelo papel, inclusive em incrementos de linha indicados pelo mecanismo. ([APH — SMART Brailler Manual, “Paper Feed Knobs”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html))

Essa capacidade não equivale a uma navegação bidimensional precisa. O manual recomenda corrigir a linha atual ou remover e reinserir a folha para correções posteriores. Ele adverte que movimentar o papel repetidamente nos dois sentidos causa *creep*: o papel sai de alinhamento e novas celas podem ficar mais altas ou mais baixas que as anteriores. Quanto mais movimentos, mais perceptível tende a ser o desvio; a espessura e a rigidez do papel também influenciam. ([Perkins School for the Blind — manual da Perkins Brailler, pp. 12–13](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf); [APH — instruções da Light-Touch Perkins Brailler, “Correcting Brailling Errors”](https://media.aph.org/app/uploads/2025/03/ltb_doc.html))

O manual informa uma tolerância de aproximadamente cinco milésimos de polegada quando a folha é totalmente retirada e reinserida pelo procedimento recomendado, valor considerado aceitável para a maioria dos usos práticos. Essa tolerância refere-se à reinserção, não constitui garantia para retornar uma linha com os botões de alimentação. ([Perkins School for the Blind — manual da Perkins Brailler, p. 12](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf))

Há também uma diferença entre a mecânica do papel e o registro eletrônico da SMART Brailler. Mover o papel pelos botões desativa o rastreamento Braille, e a FAQ oficial diz que, depois de acionar o espaçamento de linha, a edição eletrônica na própria SMART Brailler fica restrita à linha atual. Isso não impede o movimento físico do papel, mas impede tratá-lo como edição eletrônica confiável de uma linha anterior. ([APH — SMART Brailler Manual, “Braille Entry Mode and Braille Tracking”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html); [Perkins Brailler Store — FAQ da SMART Brailler](https://brailler.perkins.org/pages/perkins-brailler-faq))

## Apagamento de pontos

A Perkins Brailler clássica é fornecida com um apagador de madeira. A descrição oficial orienta usar sua ponta romba para remover pontos indesejados. O manual manda posicionar a cabeça de gravação uma ou duas celas à direita do ponto, para que a placa sob a cabeça ofereça uma superfície rígida ao apagamento manual. ([Perkins Brailler Store — Large Wooden Eraser](https://brailler.perkins.org/collections/brailler-accessories/products/large-wooden-eraser); [Perkins School for the Blind — manual da Perkins Brailler, p. 12](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf))

A APH descreve o princípio físico de forma explícita: a extremidade larga de seu apagador achata uma cela Braille inteira e a extremidade estreita achata um ponto individual. Isso sustenta tratar o apagamento como achatamento do relevo, não como remoção de uma posição do papel. ([American Printing House for the Blind — Braille Eraser, Plastic](https://www.aph.org/product/braille-eraser-plastic/))

A SMART Brailler oferece ainda o botão Easy-Erase. A pessoa retrocede até posicionar o botão sobre o erro e o pressiona firmemente várias vezes para eliminar todos os pontos da cela; o primeiro ponto de uma linha não pode ser alcançado por esse botão devido à sua posição à direita da cabeça de gravação. Para um ponto específico, o manual mantém o apagamento manual. ([APH — SMART Brailler Manual, “Easy-Erase Button” e “Correcting Brailling Errors”](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html))

O apagamento não restaura o papel a um estado novo. Os manuais alertam que gravar novamente numa cela previamente apagada pode erguer outra vez os pontos achatados. Quando for preciso adicionar e apagar pontos na mesma cela, a orientação oficial é adicionar primeiro e apagar depois. ([Perkins School for the Blind — manual da Perkins Brailler, p. 12](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf); [APH — instruções da Light-Touch Perkins Brailler, “Correcting Brailling Errors”](https://media.aph.org/app/uploads/2025/03/ltb_doc.html))

## Incertezas que permanecem

- O manual clássico não atribui formalmente um número de cela ao deslocamento da tecla de retrocesso, embora seu uso para reposicionar a cabeça sobre uma cela e a documentação equivalente da SMART Brailler sustentem a leitura de um passo por acionamento.
- Apenas o manual da SMART Brailler encontrado explicita um clique por linha ao girar os botões de alimentação em direção à pessoa. A documentação da Perkins clássica confirma o movimento bidirecional dos rolos, mas não declara a mesma granularidade em palavras.
- Nenhuma fonte primária consultada promete retorno repetível e exato a uma linha anterior. As fontes documentam justamente o risco contrário: deslocamento progressivo do papel.
- A documentação não quantifica quanto relevo ou vestígio permanece depois do apagamento manual, nem define um estado binário de ponto “apagado”. Ela apenas descreve o achatamento e a possibilidade de o ponto voltar a subir.

## Fontes primárias consultadas

- [Perkins Brailler Store — Product Manuals & FAQ](https://brailler.perkins.org/pages/product-manuals-faq)
- [Perkins School for the Blind — Perkins Brailler Manual](https://cdn.shopify.com/s/files/1/2324/6129/files/braillermanualeng_941fcd16-5986-4895-94ad-6b6a3ed89c4f.pdf)
- [American Printing House for the Blind — SMART Brailler Manual](https://sites.aph.org/files/manuals/Smart-Brailler/sb_manual.html)
- [American Printing House for the Blind — APH Light-Touch Perkins Brailler Manual](https://media.aph.org/app/uploads/2025/03/ltb_doc.html)
- [Perkins Brailler Store — Perkins Brailler FAQ](https://brailler.perkins.org/pages/perkins-brailler-faq)
- [Perkins Brailler Store — Large Wooden Eraser](https://brailler.perkins.org/collections/brailler-accessories/products/large-wooden-eraser)
- [American Printing House for the Blind — Braille Eraser, Plastic](https://www.aph.org/product/braille-eraser-plastic/)
