# Documentação de código

Estas regras orientam a documentação local de contratos e lógica de código. A
arquitetura vigente continua em `docs/architecture/`, as decisões duráveis em
`docs/adr/`, o vocabulário em `CONTEXT.md` e o comportamento executável no código
e nos testes.

## Contratos públicos

Avalie cada símbolo exposto pela interface pública de uma capacidade. Escreva
TSDoc junto à declaração original quando houver informação relevante que o tipo
e o identificador não expressem sozinhos. O arquivo que reexporta a declaração
não duplica seu TSDoc.

Registre, quando aplicável:

- o propósito no domínio e os limites da responsabilidade;
- garantias, invariantes e distinções semânticas;
- imutabilidade relevante para o consumo;
- erros que o consumidor precisa antecipar;
- um exemplo curto quando a forma correta de uso não for evidente.

Use inglês no TSDoc, nos comentários e nos exemplos de código. Use português nos
READMEs e demais explicações dirigidas a pessoas.

```ts
/**
 * Creates the canonical, immutable representation of a Braille cell.
 *
 * Duplicate dots are removed and the remaining dots are sorted.
 *
 * @throws RangeError
 * Thrown when any position is not an integer from 1 through 6.
 */
export const createBrailleCell = (
    dots: readonly number[] = [],
): BrailleCell => {
    // ...
}
```

Quando nome e tipo já comunicarem todo o contrato, mantenha a declaração sem
comentário. A revisão avalia a informação comunicada, não a presença mecânica de
um bloco TSDoc.

## Lógica interna

Antes de comentar lógica interna difícil, melhore nomes e decomposição quando
isso puder tornar o comportamento evidente sem uma refatoração estrutural.
Comentários remanescentes explicam a razão, a regra normativa, a invariante ou
a escolha algorítmica. Preserve mudanças estruturais maiores para uma tarefa
própria.

Prefira:

```ts
// A never-used position breaks adjacency even when the next cell is textual.
```

Evite narrar a instrução ou repetir o tipo:

```ts
// Increment the index.
index += 1

// Returns a Braille cell.
const createBrailleCell = (): BrailleCell => {
    // ...
}
```

## Fluxos entre módulos

Mantenha exemplos pequenos junto aos contratos. Quando o entendimento depender
da colaboração entre módulos, documente um ou dois fluxos completos no README da
capacidade, consumindo apenas sua interface pública. O exemplo deve revelar a
ordem das operações e as fronteiras entre responsabilidades sem reproduzir a
implementação interna.

## Revisão

Considere a documentação concluída quando:

- todos os contratos públicos alterados foram avaliados segundo estas regras;
- o consumidor encontra propósito, garantias, invariantes e erros relevantes
  sem reconstruí-los a partir de detalhes internos;
- os comentários explicam o porquê e continuam coerentes com código e testes;
- os fluxos documentados usam somente a interface pública da capacidade;
- formatação, lint, typecheck, testes e build continuam aprovados.
