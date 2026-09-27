import type { CSSProperties } from 'react'

import {
    createGridPosition,
    getCellImpression,
    type BrailleDot,
    type BrailleGrid,
    type CellImpression,
} from '../../braille/public'
import styles from './BrailleRenderer.module.css'

/**
 * Visual choices for rendering Braille positions and grids.
 *
 * `scale` and both dot-spacing factors are positive finite multipliers.
 * `cellGap` and `lineGap` are finite, non-negative CSS pixel values. Invalid
 * values are outside this UI contract and must not be supplied by consumers.
 */
export type BraillePresentationOptions = Readonly<{
    style: 'essential' | 'soft-frame'
    didactic: boolean
    numberFont: 'proportional' | 'monospace'
    scale: number
    horizontalDotSpacing: number
    verticalDotSpacing: number
    cellGap: number
    lineGap: number
}>

/** Returns the approved visual defaults, suitable for restoring user changes. */
export const createDefaultBraillePresentationOptions =
    (): BraillePresentationOptions =>
        Object.freeze({
            style: 'essential',
            didactic: false,
            numberFont: 'proportional',
            scale: 1,
            horizontalDotSpacing: 1,
            verticalDotSpacing: 1,
            cellGap: 11.4,
            lineGap: 13.41,
        })

type CustomProperties = CSSProperties & Record<`--${string}`, string>

const dotOrder = [1, 4, 2, 5, 3, 6] as const satisfies readonly BrailleDot[]

const joinDots = (dots: readonly BrailleDot[]) => {
    if (dots.length === 1) return String(dots[0])
    return `${dots.slice(0, -1).join(', ')} e ${dots.at(-1)}`
}

/** Describes one position without relying on its visual representation. */
export const describeCellImpression = (
    impression: CellImpression | undefined,
): string => {
    if (impression === undefined) return 'Posição nunca utilizada.'
    if (impression.cell.dots.length === 0 && impression.erasedDots.length === 0)
        return 'Espaço explícito.'

    const raised =
        impression.cell.dots.length === 0
            ? 'Sem pontos elevados.'
            : `Pontos elevados: ${joinDots(impression.cell.dots)}.`
    const erased =
        impression.erasedDots.length === 0
            ? 'Sem vestígios de pontos apagados.'
            : `Vestígios de pontos apagados: ${joinDots(impression.erasedDots)}.`
    return `${raised} ${erased}`
}

export type CellImpressionViewProps = Readonly<{
    impression: CellImpression | undefined
    options?: BraillePresentationOptions
}>

const presentationStyle = (
    options: BraillePresentationOptions,
): CustomProperties => {
    const framed = options.style === 'soft-frame'
    const pitch = framed ? 32 : 35.1
    return {
        '--braille-scale': String(options.scale),
        '--braille-dot-spacing-x': String(options.horizontalDotSpacing),
        '--braille-dot-spacing-y': String(options.verticalDotSpacing),
        '--braille-pitch-x': `${pitch * options.horizontalDotSpacing * options.scale}px`,
        '--braille-pitch-y': `${pitch * options.verticalDotSpacing * options.scale}px`,
        '--braille-padding-x': `${(framed ? 14 : 0) * options.scale}px`,
        '--braille-padding-y': `${(framed ? 16 : 0) * options.scale}px`,
        '--braille-raised-size': `${(framed ? 20 : 21.6) * options.scale}px`,
        '--braille-inactive-size': `${7 * options.scale}px`,
        '--braille-number-size': `${14 * options.scale}px`,
    }
}

/** Renders one used or never-used Braille grid position from domain data. */
export function CellImpressionView({
    impression,
    options = createDefaultBraillePresentationOptions(),
}: CellImpressionViewProps) {
    const className = `${styles['braille-cell']} ${
        impression === undefined ? styles['braille-cell--unused'] : ''
    }`

    return (
        <span
            className={className}
            role="img"
            aria-label={describeCellImpression(impression)}
            data-style={options.style}
            data-didactic={String(options.didactic)}
            data-number-font={options.numberFont}
            style={presentationStyle(options)}
        >
            {impression === undefined ? null : (
                <span
                    className={styles['braille-cell__dots']}
                    aria-hidden="true"
                >
                    {dotOrder.map((dot) => {
                        const state = impression.cell.dots.includes(dot)
                            ? 'raised'
                            : impression.erasedDots.includes(dot)
                              ? 'erased'
                              : 'inactive'
                        return (
                            <span
                                className={styles['braille-cell__slot']}
                                key={dot}
                                data-dot={dot}
                            >
                                <span
                                    className={styles['braille-cell__dot']}
                                    data-dot-state={state}
                                >
                                    {options.didactic ? dot : null}
                                </span>
                            </span>
                        )
                    })}
                </span>
            )}
        </span>
    )
}

/**
 * Grid composition inputs.
 *
 * `rows` and `columns` are positive integers describing the visible grid.
 */
export type BrailleGridViewProps = Readonly<{
    grid: BrailleGrid
    rows: number
    columns: number
    options?: BraillePresentationOptions
    'aria-label': string
}>

/** Composes accessible positions while leaving selection and actions to its consumer. */
export function BrailleGridView({
    grid,
    rows,
    columns,
    options = createDefaultBraillePresentationOptions(),
    'aria-label': ariaLabel,
}: BrailleGridViewProps) {
    const style: CustomProperties = {
        '--braille-grid-columns': String(columns),
        '--braille-cell-gap': `${options.cellGap}px`,
        '--braille-line-gap': `${options.lineGap}px`,
    }
    return (
        <div
            className={styles['braille-grid']}
            role="grid"
            aria-label={ariaLabel}
            aria-rowcount={rows}
            aria-colcount={columns}
            style={style}
        >
            {Array.from({ length: rows }, (_, row) => (
                <div
                    role="row"
                    className={styles['braille-grid__row']}
                    key={row}
                >
                    {Array.from({ length: columns }, (_, column) => {
                        const impression = getCellImpression(
                            grid,
                            createGridPosition(row, column),
                        )
                        return (
                            <div
                                role="gridcell"
                                aria-label={`Linha ${row + 1}, coluna ${column + 1}. ${describeCellImpression(impression)}`}
                                key={column}
                            >
                                <span aria-hidden="true">
                                    <CellImpressionView
                                        impression={impression}
                                        options={options}
                                    />
                                </span>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
