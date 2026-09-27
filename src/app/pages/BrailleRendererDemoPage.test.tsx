import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'

import BrailleRendererDemoPage from './BrailleRendererDemoPage'

describe('BrailleRendererDemoPage', () => {
    test('shows a navigable preview and examples of every position state', () => {
        render(
            <MemoryRouter>
                <BrailleRendererDemoPage />
            </MemoryRouter>,
        )

        expect(
            screen.getByRole('link', { name: 'Voltar ao início' }),
        ).toHaveAttribute('href', '/')
        expect(document.title).toBe(
            'Cela Braille em detalhe | Máquina Den Braille',
        )
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Cela Braille em detalhe',
            }),
        ).toHaveFocus()

        const preview = screen.getByRole('region', { name: 'Sua amostra' })
        expect(
            within(preview).getByRole('img', {
                name: 'Pontos elevados: 1 e 4. Vestígios de pontos apagados: 2.',
            }),
        ).toHaveStyle({ '--braille-scale': '2' })

        const examples = screen.getByRole('region', {
            name: 'Estados para comparar',
        })
        expect(
            within(examples).getByRole('img', { name: 'Espaço explícito.' }),
        ).toBeInTheDocument()
        expect(
            within(examples).getByRole('img', {
                name: 'Posição nunca utilizada.',
            }),
        ).toBeInTheDocument()
        expect(within(examples).getAllByRole('img')).toHaveLength(5)
    })

    test('changes dot states and presentation, then restores defaults', () => {
        render(
            <MemoryRouter>
                <BrailleRendererDemoPage />
            </MemoryRouter>,
        )

        const preview = screen.getByRole('region', { name: 'Sua amostra' })
        fireEvent.change(screen.getByRole('combobox', { name: 'Ponto 3' }), {
            target: { value: 'raised' },
        })
        fireEvent.click(screen.getByRole('radio', { name: 'Moldura suave' }))
        fireEvent.click(
            screen.getByRole('checkbox', {
                name: 'Mostrar numeração didática',
            }),
        )
        fireEvent.change(
            screen.getByRole('slider', { name: /Escala da amostra/ }),
            {
                target: { value: '1.5' },
            },
        )

        const changed = within(preview).getByRole('img', {
            name: 'Pontos elevados: 1, 3 e 4. Vestígios de pontos apagados: 2.',
        })
        expect(changed).toHaveAttribute('data-style', 'soft-frame')
        expect(changed).toHaveAttribute('data-didactic', 'true')
        expect(changed).toHaveStyle({ '--braille-scale': '1.5' })

        fireEvent.click(
            screen.getByRole('button', { name: 'Restaurar padrões' }),
        )

        const restored = within(preview).getByRole('img', {
            name: 'Pontos elevados: 1 e 4. Vestígios de pontos apagados: 2.',
        })
        expect(restored).toHaveAttribute('data-style', 'essential')
        expect(restored).toHaveAttribute('data-didactic', 'false')
        expect(restored).toHaveStyle({ '--braille-scale': '1' })
    })
})
