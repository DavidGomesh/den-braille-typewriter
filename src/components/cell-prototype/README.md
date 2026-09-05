# Protótipo de Impressões de cela

Executar na raiz: `npm run prototype`. Abrir http://localhost:3001/den-braille-typewriter/free?variant=B.

Artefato descartável de discussão, independente do build da aplicação. HTML/CSS nas apresentações comum (B) e didática (C), conforme orientação do mantenedor. A troca mantém o experimento em memória. Sem gravação de documentos.

O retângulo de 93 × 150 px centraliza uma matriz de seis posições. Centros separados por 35,1 px e pontos elevados de 21,6 px preservam a relação 2,34 / 1,44. Pontos inativos pequenos cinza, elevados grandes pretos e apagados grandes cinza. No modo didático todos são grandes, com números internos; elevados têm número branco. O cinza não representa ponto elevado. Descrição textual acompanha todos os estados.

Este laboratório usa a URL do Modo livre, servido por um servidor próprio sem dependências. Não implementa a Sessão de digitação. Avaliar centralização, estados e numeração com o mantenedor antes de resolver o ticket. Sem validação de tamanho físico, leitor de tela ou desempenho de grades extensas nesta etapa.

## Ajuste para comparação visual

Pontos apagados e inativos usam cinza claro `#ccc`, mantendo elevados em `#111`. A apresentação didática permite comparar fonte proporcional e monoespaçada apenas nos números. Contorno das celas opcional, inicialmente desligado; seleção e foco continuam visíveis. As opções não alteram a geometria ou o conteúdo. A paleta clara ainda precisa de avaliação de acessibilidade antes da implementação definitiva; não constitui aprovação de contraste.
