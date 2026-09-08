import { describe, expect, test } from 'vitest'

import {
    aplicarIntencao,
    criarCelaBraille,
    criarEstadoMotor,
    criarPontoBraille,
} from './public'

describe('valores fundamentais do Motor', () => {
    test('aceita somente as seis posições de Ponto Braille', () => {
        expect([1, 2, 3, 4, 5, 6].map(criarPontoBraille)).toEqual([
            1, 2, 3, 4, 5, 6,
        ])
        expect(() => criarPontoBraille(0)).toThrowError(RangeError)
        expect(() => criarPontoBraille(7)).toThrowError(RangeError)
        expect(() => criarPontoBraille(1.5)).toThrowError(RangeError)
    })

    test('cria uma Cela Braille canônica e imutável', () => {
        const cela = criarCelaBraille([6, 1, 1, 3])

        expect(cela).toEqual({ pontos: [1, 3, 6] })
        expect(criarCelaBraille()).toEqual({ pontos: [] })
        expect(Object.isFrozen(cela)).toBe(true)
        expect(Object.isFrozen(cela.pontos)).toBe(true)
        expect(() => criarCelaBraille([8])).toThrowError(RangeError)
    })
})

describe('Acorde Braille', () => {
    test('confirma os pontos sobrepostos somente após liberar todos', () => {
        const ponto1 = criarPontoBraille(1)
        const ponto4 = criarPontoBraille(4)
        const pressionou1 = aplicarIntencao(criarEstadoMotor(), {
            tipo: 'pressionar',
            controle: { tipo: 'ponto', ponto: ponto1 },
        })
        const pressionou4 = aplicarIntencao(pressionou1.estado, {
            tipo: 'pressionar',
            controle: { tipo: 'ponto', ponto: ponto4 },
        })
        const liberou1 = aplicarIntencao(pressionou4.estado, {
            tipo: 'liberar',
            controle: { tipo: 'ponto', ponto: ponto1 },
        })

        expect(liberou1.eventos).toEqual([])
        expect(liberou1.snapshot.acorde).toEqual({
            pontosAcumulados: [1, 4],
            pontosPressionados: [4],
        })

        const liberou4 = aplicarIntencao(liberou1.estado, {
            tipo: 'liberar',
            controle: { tipo: 'ponto', ponto: ponto4 },
        })

        expect(liberou4.eventos).toEqual([
            {
                tipo: 'operacao-produzida',
                operacao: {
                    tipo: 'confirmar-cela',
                    cela: { pontos: [1, 4] },
                },
            },
        ])
        expect(liberou4.snapshot.acorde).toEqual({
            pontosAcumulados: [],
            pontosPressionados: [],
        })
    })
})

describe('Operações da máquina', () => {
    test.each([
        'espaco',
        'retrocesso',
        'espacamento-linha',
        'retorno-carro',
    ] as const)(
        '%s produz uma operação por ciclo de pressão e liberação',
        (tipo) => {
            const pressionou = aplicarIntencao(criarEstadoMotor(), {
                tipo: 'pressionar',
                controle: { tipo },
            })

            expect(pressionou.eventos).toEqual([])

            const liberou = aplicarIntencao(pressionou.estado, {
                tipo: 'liberar',
                controle: { tipo },
            })

            expect(liberou.eventos).toEqual([
                { tipo: 'operacao-produzida', operacao: { tipo } },
            ])
        },
    )

    test('rejeita repetição enquanto um controle permanece pressionado', () => {
        const intencao = {
            tipo: 'pressionar',
            controle: { tipo: 'espaco' },
        } as const
        const primeiraPressao = aplicarIntencao(criarEstadoMotor(), intencao)
        const repeticao = aplicarIntencao(primeiraPressao.estado, intencao)

        expect(repeticao.estado).toBe(primeiraPressao.estado)
        expect(repeticao.eventos).toEqual([
            {
                tipo: 'entrada-rejeitada',
                motivo: 'controle-ja-pressionado',
            },
        ])
    })
})

describe('término não confirmatório da captura', () => {
    const estadoComAcorde = () => {
        const pressionou1 = aplicarIntencao(criarEstadoMotor(), {
            tipo: 'pressionar',
            controle: { tipo: 'ponto', ponto: criarPontoBraille(1) },
        })
        return aplicarIntencao(pressionou1.estado, {
            tipo: 'pressionar',
            controle: { tipo: 'ponto', ponto: criarPontoBraille(5) },
        }).estado
    }

    test('Cancelamento da entrada sempre descarta o acorde', () => {
        const resultado = aplicarIntencao(estadoComAcorde(), {
            tipo: 'cancelar-entrada',
        })

        expect(resultado.snapshot.acorde).toEqual({
            pontosAcumulados: [],
            pontosPressionados: [],
        })
        expect(resultado.eventos).toEqual([
            {
                tipo: 'acorde-descartado',
                causa: 'cancelamento',
                cela: { pontos: [1, 5] },
            },
        ])
    })

    test('Interrupção da captura descarta o acorde quando essa é a política', () => {
        const resultado = aplicarIntencao(estadoComAcorde(), {
            tipo: 'interromper-captura',
            politica: 'descartar',
        })

        expect(resultado.snapshot).toEqual({
            acorde: { pontosAcumulados: [], pontosPressionados: [] },
            controlesPressionados: [],
        })
        expect(resultado.eventos).toEqual([
            {
                tipo: 'acorde-descartado',
                causa: 'interrupcao',
                cela: { pontos: [1, 5] },
            },
        ])
    })

    test('Interrupção da captura confirma o acorde quando essa é a política', () => {
        const resultado = aplicarIntencao(estadoComAcorde(), {
            tipo: 'interromper-captura',
            politica: 'confirmar',
        })

        expect(resultado.snapshot.acorde).toEqual({
            pontosAcumulados: [],
            pontosPressionados: [],
        })
        expect(resultado.eventos).toEqual([
            {
                tipo: 'operacao-produzida',
                operacao: {
                    tipo: 'confirmar-cela',
                    cela: { pontos: [1, 5] },
                },
            },
        ])
    })
})
