import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import {
    createBrailleCell,
    createBrailleDot,
    createBrailleGrid,
    createCellImpression,
    createGridPosition,
    recordCellImpression,
} from '../../braille/public'
import {
    BrailleGridView,
    CellImpressionView,
    createDefaultBraillePresentationOptions,
} from '../public'

describe('CellImpressionView', () => {
    test('describes and draws every position state without exposing the dots as items', () => {
        const impression = createCellImpression(createBrailleCell([1, 4]), [
            createBrailleDot(2),
        ])
        const { rerender } = render(
            <CellImpressionView impression={impression} />,
        )

        const used = screen.getByRole('img', {
            name: 'Pontos elevados: 1 e 4. Vestígios de pontos apagados: 2.',
        })
        expect(used).toHaveAttribute('data-style', 'essential')
        expect(used).toHaveAttribute('data-didactic', 'false')
        expect(within(used).queryAllByRole('listitem')).toHaveLength(0)
        expect(used.querySelectorAll('[data-dot-state="raised"]')).toHaveLength(
            2,
        )
        expect(used.querySelectorAll('[data-dot-state="erased"]')).toHaveLength(
            1,
        )
        expect(
            used.querySelectorAll('[data-dot-state="inactive"]'),
        ).toHaveLength(3)

        rerender(<CellImpressionView impression={createCellImpression()} />)
        expect(
            screen.getByRole('img', { name: 'Espaço explícito.' }),
        ).toBeInTheDocument()

        rerender(<CellImpressionView impression={undefined} />)
        expect(
            screen.getByRole('img', { name: 'Posição nunca utilizada.' }),
        ).toBeEmptyDOMElement()
    })

    test('applies configurable presentation options and restores approved defaults', () => {
        const defaults = createDefaultBraillePresentationOptions()
        const configured = {
            ...defaults,
            style: 'soft-frame' as const,
            didactic: true,
            numberFont: 'monospace' as const,
            scale: 1.5,
            horizontalDotSpacing: 1.2,
            verticalDotSpacing: 0.8,
        }
        const { rerender } = render(
            <CellImpressionView
                impression={createCellImpression(createBrailleCell([1]))}
                options={configured}
            />,
        )

        const configuredCell = screen.getByRole('img')
        expect(configuredCell).toHaveAttribute('data-style', 'soft-frame')
        expect(configuredCell).toHaveAttribute('data-didactic', 'true')
        expect(configuredCell).toHaveAttribute('data-number-font', 'monospace')
        expect(configuredCell).toHaveStyle({
            '--braille-scale': '1.5',
            '--braille-dot-spacing-x': '1.2',
            '--braille-dot-spacing-y': '0.8',
        })
        expect(configuredCell).toHaveTextContent('142536')

        rerender(
            <CellImpressionView
                impression={createCellImpression(createBrailleCell([1]))}
                options={createDefaultBraillePresentationOptions()}
            />,
        )
        expect(screen.getByRole('img')).toHaveAttribute(
            'data-style',
            'essential',
        )
        expect(screen.getByRole('img')).not.toHaveTextContent('142536')
    })
})

describe('BrailleGridView', () => {
    test('renders used and unused domain positions with configurable grid spacing', () => {
        const recorded = recordCellImpression(
            createBrailleGrid(),
            createGridPosition(0, 0),
            createCellImpression(createBrailleCell([1])),
        )
        if (recorded.status !== 'recorded')
            throw new Error('recorded grid expected')

        render(
            <BrailleGridView
                grid={recorded.grid}
                rows={1}
                columns={2}
                aria-label="Documento Braille"
                options={{
                    ...createDefaultBraillePresentationOptions(),
                    cellGap: 22.8,
                    lineGap: 26.82,
                }}
            />,
        )

        const grid = screen.getByRole('grid', { name: 'Documento Braille' })
        expect(grid).toHaveStyle({
            '--braille-cell-gap': '22.8px',
            '--braille-line-gap': '26.82px',
        })
        expect(within(grid).getAllByRole('gridcell')).toHaveLength(2)
        expect(
            within(grid).getByRole('gridcell', {
                name: 'Linha 1, coluna 1. Pontos elevados: 1. Sem vestígios de pontos apagados.',
            }),
        ).toBeInTheDocument()
        expect(
            within(grid).getByRole('gridcell', {
                name: 'Linha 1, coluna 2. Posição nunca utilizada.',
            }),
        ).toBeInTheDocument()
        expect(within(grid).queryAllByRole('img')).toHaveLength(0)
    })
})
