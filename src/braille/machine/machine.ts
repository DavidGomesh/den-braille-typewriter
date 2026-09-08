import { criarCelaBraille, type CelaBraille, type PontoBraille } from './values'

export type TipoOperacaoDireta =
    'espaco' | 'retrocesso' | 'espacamento-linha' | 'retorno-carro'

export type ControleMaquina =
    | Readonly<{
          tipo: 'ponto'
          ponto: PontoBraille
      }>
    | Readonly<{ tipo: TipoOperacaoDireta }>

export type IntencaoMaquina =
    | Readonly<{ tipo: 'pressionar'; controle: ControleMaquina }>
    | Readonly<{ tipo: 'liberar'; controle: ControleMaquina }>
    | Readonly<{ tipo: 'cancelar-entrada' }>
    | Readonly<{
          tipo: 'interromper-captura'
          politica: 'descartar' | 'confirmar'
      }>

export type OperacaoMaquina =
    | Readonly<{
          tipo: 'confirmar-cela'
          cela: CelaBraille
      }>
    | Readonly<{ tipo: TipoOperacaoDireta }>

export type EventoMotor =
    | Readonly<{
          tipo: 'operacao-produzida'
          operacao: OperacaoMaquina
      }>
    | Readonly<{
          tipo: 'entrada-rejeitada'
          motivo: 'controle-ja-pressionado' | 'controle-nao-pressionado'
      }>
    | Readonly<{
          tipo: 'acorde-descartado'
          causa: 'cancelamento' | 'interrupcao'
          cela: CelaBraille
      }>

export type EstadoMotor = Readonly<{
    pontosAcumulados: readonly PontoBraille[]
    pontosPressionados: readonly PontoBraille[]
    controlesPressionados: readonly TipoOperacaoDireta[]
}>

export type SnapshotMotor = Readonly<{
    acorde: Readonly<{
        pontosAcumulados: readonly PontoBraille[]
        pontosPressionados: readonly PontoBraille[]
    }>
    controlesPressionados: readonly TipoOperacaoDireta[]
}>

export type ResultadoMotor = Readonly<{
    estado: EstadoMotor
    snapshot: SnapshotMotor
    eventos: readonly EventoMotor[]
}>

const criarEstado = (
    pontosPressionados: readonly PontoBraille[],
    pontosAcumulados: readonly PontoBraille[],
    controlesPressionados: readonly TipoOperacaoDireta[] = [],
): EstadoMotor =>
    Object.freeze({
        pontosPressionados: Object.freeze([...pontosPressionados].sort()),
        pontosAcumulados: Object.freeze([...pontosAcumulados].sort()),
        controlesPressionados: Object.freeze([...controlesPressionados].sort()),
    })

export const criarEstadoMotor = (): EstadoMotor => criarEstado([], [])

const criarResultado = (
    estado: EstadoMotor,
    eventos: readonly EventoMotor[] = [],
): ResultadoMotor =>
    Object.freeze({
        estado,
        snapshot: Object.freeze({
            acorde: Object.freeze({
                pontosAcumulados: estado.pontosAcumulados,
                pontosPressionados: estado.pontosPressionados,
            }),
            controlesPressionados: estado.controlesPressionados,
        }),
        eventos: Object.freeze([...eventos]),
    })

export const aplicarIntencao = (
    estado: EstadoMotor,
    intencao: IntencaoMaquina,
): ResultadoMotor => {
    const rejeitar = (
        motivo: 'controle-ja-pressionado' | 'controle-nao-pressionado',
    ) =>
        criarResultado(estado, [
            Object.freeze({ tipo: 'entrada-rejeitada', motivo }),
        ])

    if (intencao.tipo === 'cancelar-entrada') {
        return criarResultado(
            criarEstado([], [], estado.controlesPressionados),
            [
                Object.freeze({
                    tipo: 'acorde-descartado',
                    causa: 'cancelamento',
                    cela: criarCelaBraille(estado.pontosAcumulados),
                }),
            ],
        )
    }

    if (intencao.tipo === 'interromper-captura') {
        if (estado.pontosAcumulados.length === 0) {
            return criarResultado(criarEstadoMotor())
        }

        const cela = criarCelaBraille(estado.pontosAcumulados)
        if (intencao.politica === 'confirmar') {
            return criarResultado(criarEstadoMotor(), [
                Object.freeze({
                    tipo: 'operacao-produzida',
                    operacao: Object.freeze({ tipo: 'confirmar-cela', cela }),
                }),
            ])
        }

        return criarResultado(criarEstadoMotor(), [
            Object.freeze({
                tipo: 'acorde-descartado',
                causa: 'interrupcao',
                cela,
            }),
        ])
    }

    if (intencao.controle.tipo !== 'ponto') {
        const controle = intencao.controle.tipo
        const estaPressionado = estado.controlesPressionados.includes(controle)

        if (intencao.tipo === 'pressionar') {
            if (estaPressionado) return rejeitar('controle-ja-pressionado')

            return criarResultado(
                criarEstado(
                    estado.pontosPressionados,
                    estado.pontosAcumulados,
                    [...estado.controlesPressionados, controle],
                ),
            )
        }

        if (!estaPressionado) return rejeitar('controle-nao-pressionado')

        return criarResultado(
            criarEstado(
                estado.pontosPressionados,
                estado.pontosAcumulados,
                estado.controlesPressionados.filter(
                    (pressionado) => pressionado !== controle,
                ),
            ),
            [
                Object.freeze({
                    tipo: 'operacao-produzida',
                    operacao: Object.freeze({ tipo: controle }),
                }),
            ],
        )
    }

    const ponto = intencao.controle.ponto
    const estaPressionado = estado.pontosPressionados.includes(ponto)

    if (intencao.tipo === 'pressionar') {
        if (estaPressionado) return rejeitar('controle-ja-pressionado')

        return criarResultado(
            criarEstado(
                [...estado.pontosPressionados, ponto],
                estado.pontosAcumulados.includes(ponto)
                    ? estado.pontosAcumulados
                    : [...estado.pontosAcumulados, ponto],
                estado.controlesPressionados,
            ),
        )
    }

    if (!estaPressionado) return rejeitar('controle-nao-pressionado')

    const pontosPressionados = estado.pontosPressionados.filter(
        (pressionado) => pressionado !== ponto,
    )
    if (pontosPressionados.length > 0) {
        return criarResultado(
            criarEstado(
                pontosPressionados,
                estado.pontosAcumulados,
                estado.controlesPressionados,
            ),
        )
    }

    const cela = criarCelaBraille(estado.pontosAcumulados)
    return criarResultado(criarEstado([], [], estado.controlesPressionados), [
        Object.freeze({
            tipo: 'operacao-produzida',
            operacao: Object.freeze({ tipo: 'confirmar-cela', cela }),
        }),
    ])
}
