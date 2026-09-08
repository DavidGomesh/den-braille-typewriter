export type PontoBraille = 1 | 2 | 3 | 4 | 5 | 6

export type CelaBraille = Readonly<{
    pontos: readonly PontoBraille[]
}>

export const criarPontoBraille = (posicao: number): PontoBraille => {
    if (!Number.isInteger(posicao) || posicao < 1 || posicao > 6) {
        throw new RangeError(`Posição Braille inválida: ${posicao}`)
    }

    return posicao as PontoBraille
}

export const criarCelaBraille = (
    posicoes: readonly number[] = [],
): CelaBraille => {
    const pontos = [...new Set(posicoes.map(criarPontoBraille))].sort(
        (a, b) => a - b,
    )

    return Object.freeze({ pontos: Object.freeze(pontos) })
}
