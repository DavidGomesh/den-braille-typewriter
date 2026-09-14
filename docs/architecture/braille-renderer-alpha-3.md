# Renderer visual Braille — alpha.3

## Contrato implementado

`CellImpressionView` apresenta uma posição a partir de `CellImpression | undefined`
e das opções visuais. Ela não recebe Sessão de digitação, Experiência do
simulador, áudio, interpretação, coordenadas ou ações. `BrailleGridView` compõe
posições a partir de `BrailleGrid`, identifica suas coordenadas e mantém seleção,
foco e navegação sob responsabilidade de quem a consome.

Os seis pontos são HTML/CSS sem fonte Braille, SVG ou Canvas e ficam ocultos da
árvore acessível como primitivas gráficas. Cada posição expõe uma única
descrição que distingue pontos elevados, vestígios, espaço explícito e posição
nunca utilizada. O estilo Essencial é o padrão; Moldura suave, numeração
didática, fonte dos números, escala e espaçamentos são opções independentes. A
função `createDefaultBraillePresentationOptions` restaura os padrões aprovados.

## Verificação automática

Execute:

```sh
npm test -- --run src/ui/braille/BrailleRenderer.test.tsx
npm run typecheck
npm run architecture
```

Os testes observam a interface pública e o DOM acessível: estados visuais,
descrições, ausência de seis itens acessíveis, opções, restauração, coordenadas
e espaçamentos. A folha de estilos preserva distinções sem depender somente de
cor: pontos elevados são preenchidos, vestígios têm contorno e tamanho de ponto
elevado, e posições nunca utilizadas não desenham pontos. Em cores forçadas,
os estados usam cores do sistema e contornos sólidos ou tracejados.

## Procedimento manual aplicável

Preparação: executar o build da branch em navegador desktop e abrir uma amostra
que contenha ponto elevado, inativo, vestígio, espaço explícito e posição nunca
utilizada nos dois estilos, com e sem numeração didática. Registrar sistema,
navegador e versões, escala do sistema, data, pessoa responsável e capturas.

1. Aplicar zoom do navegador em 200% e 400%. Confirmar que cada estado permanece
   legível, que a grade pode ser percorrida sem conteúdo encoberto e que o
   overflow bidimensional não bloqueia o restante da página.
2. Reduzir a viewport para 320 CSS px. Confirmar que a ordem semântica permanece,
   a grade oferece rolagem própria quando necessária e nenhum controle externo
   é perdido ou sobreposto.
3. Ativar alto contraste/cores forçadas do sistema. Confirmar que elevado,
   inativo e vestígio continuam distinguíveis por preenchimento, tamanho e
   contorno, nos estilos Essencial e Moldura suave.
4. Inspecionar contraste dos pontos e contornos necessários com ferramenta do
   navegador. Registrar valores e corrigir qualquer parte gráfica abaixo de
   3:1 contra cores adjacentes no modo de cores normal.
5. Com NVDA/Firefox, NVDA/Chrome e VoiceOver/Safari, percorrer a grade. Confirmar
   anúncio único por posição, com linha, coluna e estado, sem seis itens para os
   pontos e sem depender da aparência visual.

Resultado esperado: todos os estados e opções permanecem distinguíveis e
operáveis nos ambientes aplicáveis. Esta verificação não declara conformidade
integral com WCAG 2.2 AA ou ABNT NBR 17225:2025; limita-se ao renderer.
