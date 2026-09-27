import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    createBrailleCell,
    createCellImpression,
    type BrailleDot,
    type CellImpression,
} from '../../braille/public'
import {
    CellImpressionView,
    createDefaultBraillePresentationOptions,
    describeCellImpression,
    type BraillePresentationOptions,
} from '../../ui/public'
import styles from './BrailleRendererDemoPage.module.css'

type DotState = 'raised' | 'inactive' | 'erased'

const dots = [1, 2, 3, 4, 5, 6] as const satisfies readonly BrailleDot[]

const initialDots: Record<BrailleDot, DotState> = {
    1: 'raised',
    2: 'erased',
    3: 'inactive',
    4: 'raised',
    5: 'inactive',
    6: 'inactive',
}

const initialOptions: BraillePresentationOptions = {
    ...createDefaultBraillePresentationOptions(),
    scale: 2,
}

const examples: readonly {
    title: string
    detail: string
    impression: CellImpression | undefined
}[] = [
    {
        title: 'Pontos elevados',
        detail: 'Preenchidos e maiores que os pontos inativos.',
        impression: createCellImpression(createBrailleCell([1, 2, 4])),
    },
    {
        title: 'Pontos inativos',
        detail: 'A posição foi usada; os demais pontos não foram elevados.',
        impression: createCellImpression(createBrailleCell([1])),
    },
    {
        title: 'Vestígio',
        detail: 'O contorno mostra um ponto elevado e depois apagado.',
        impression: createCellImpression(createBrailleCell([1, 4]), [2]),
    },
    {
        title: 'Espaço explícito',
        detail: 'A posição foi produzida sem pontos elevados.',
        impression: createCellImpression(),
    },
    {
        title: 'Nunca utilizada',
        detail: 'Ainda não há Impressão de cela nesta posição.',
        impression: undefined,
    },
]

export default function BrailleRendererDemoPage() {
    const titleRef = useRef<HTMLHeadingElement>(null)
    const [dotStates, setDotStates] = useState(initialDots)
    const [options, setOptions] = useState(initialOptions)

    const impression = createCellImpression(
        createBrailleCell(dots.filter((dot) => dotStates[dot] === 'raised')),
        dots.filter((dot) => dotStates[dot] === 'erased'),
    )
    const exampleOptions: BraillePresentationOptions = { ...options, scale: 1 }

    useEffect(() => {
        document.title = 'Cela Braille em detalhe | Máquina Den Braille'
        titleRef.current?.focus()
    }, [])

    function updateOption<Key extends keyof BraillePresentationOptions>(
        key: Key,
        value: BraillePresentationOptions[Key],
    ) {
        setOptions((current) => ({ ...current, [key]: value }))
    }

    function restoreDefaults() {
        setDotStates(initialDots)
        setOptions(createDefaultBraillePresentationOptions())
    }

    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <nav aria-label="Navegação da demonstração">
                    <Link className={styles.backLink} to="/">
                        Voltar ao início
                    </Link>
                </nav>

                <header className={styles.intro}>
                    <h1 ref={titleRef} tabIndex={-1}>
                        Cela Braille em detalhe
                    </h1>
                    <p>
                        Observe como os seis pontos mudam de estado. Esta é uma
                        demonstração visual do novo renderer, separada dos modos
                        de digitação.
                    </p>
                </header>

                <div className={styles.workbench}>
                    <section
                        className={styles.preview}
                        aria-labelledby="preview-title"
                    >
                        <div className={styles.sectionHeading}>
                            <h2 id="preview-title">Sua amostra</h2>
                            <span>
                                Altere os pontos nos controles desta página
                            </span>
                        </div>
                        <div className={styles.previewStage}>
                            <CellImpressionView
                                impression={impression}
                                options={options}
                            />
                        </div>
                        <p className={styles.description} aria-live="polite">
                            {describeCellImpression(impression)}
                        </p>
                    </section>

                    <section
                        className={styles.controls}
                        aria-labelledby="controls-title"
                    >
                        <div className={styles.sectionHeading}>
                            <h2 id="controls-title">Ajustes</h2>
                            <button
                                className={styles.resetButton}
                                type="button"
                                onClick={restoreDefaults}
                            >
                                Restaurar padrões
                            </button>
                        </div>

                        <fieldset className={styles.dotFieldset}>
                            <legend>Estado de cada ponto</legend>
                            <div className={styles.dotControls}>
                                {dots.map((dot) => (
                                    <label
                                        className={styles.dotControl}
                                        key={dot}
                                    >
                                        <span>Ponto {dot}</span>
                                        <select
                                            value={dotStates[dot]}
                                            onChange={(event) =>
                                                setDotStates((current) => ({
                                                    ...current,
                                                    [dot]: event.target
                                                        .value as DotState,
                                                }))
                                            }
                                        >
                                            <option value="raised">
                                                Elevado
                                            </option>
                                            <option value="inactive">
                                                Inativo
                                            </option>
                                            <option value="erased">
                                                Vestígio
                                            </option>
                                        </select>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className={styles.styleFieldset}>
                            <legend>Estilo da cela</legend>
                            <label>
                                <input
                                    type="radio"
                                    name="braille-style"
                                    checked={options.style === 'essential'}
                                    onChange={() =>
                                        updateOption('style', 'essential')
                                    }
                                />
                                Essencial
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="braille-style"
                                    checked={options.style === 'soft-frame'}
                                    onChange={() =>
                                        updateOption('style', 'soft-frame')
                                    }
                                />
                                Moldura suave
                            </label>
                        </fieldset>

                        <div className={styles.optionControls}>
                            <label className={styles.checkControl}>
                                <input
                                    type="checkbox"
                                    checked={options.didactic}
                                    onChange={(event) =>
                                        updateOption(
                                            'didactic',
                                            event.target.checked,
                                        )
                                    }
                                />
                                Mostrar numeração didática
                            </label>
                            {options.didactic && (
                                <label className={styles.selectControl}>
                                    Fonte dos números
                                    <select
                                        value={options.numberFont}
                                        onChange={(event) =>
                                            updateOption(
                                                'numberFont',
                                                event.target
                                                    .value as BraillePresentationOptions['numberFont'],
                                            )
                                        }
                                    >
                                        <option value="proportional">
                                            Proporcional
                                        </option>
                                        <option value="monospace">
                                            Monoespaçada
                                        </option>
                                    </select>
                                </label>
                            )}
                            <label
                                className={styles.rangeControl}
                                htmlFor="demo-scale"
                            >
                                <span>
                                    Escala da amostra
                                    <output>{options.scale.toFixed(2)}×</output>
                                </span>
                                <input
                                    id="demo-scale"
                                    type="range"
                                    min="0.75"
                                    max="2.5"
                                    step="0.25"
                                    value={options.scale}
                                    onChange={(event) =>
                                        updateOption(
                                            'scale',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </label>
                            <label
                                className={styles.rangeControl}
                                htmlFor="demo-horizontal-spacing"
                            >
                                <span>
                                    Distância horizontal
                                    <output>
                                        {options.horizontalDotSpacing.toFixed(
                                            2,
                                        )}
                                        ×
                                    </output>
                                </span>
                                <input
                                    id="demo-horizontal-spacing"
                                    type="range"
                                    min="0.75"
                                    max="1.5"
                                    step="0.05"
                                    value={options.horizontalDotSpacing}
                                    onChange={(event) =>
                                        updateOption(
                                            'horizontalDotSpacing',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </label>
                            <label
                                className={styles.rangeControl}
                                htmlFor="demo-vertical-spacing"
                            >
                                <span>
                                    Distância vertical
                                    <output>
                                        {options.verticalDotSpacing.toFixed(2)}×
                                    </output>
                                </span>
                                <input
                                    id="demo-vertical-spacing"
                                    type="range"
                                    min="0.75"
                                    max="1.5"
                                    step="0.05"
                                    value={options.verticalDotSpacing}
                                    onChange={(event) =>
                                        updateOption(
                                            'verticalDotSpacing',
                                            Number(event.target.value),
                                        )
                                    }
                                />
                            </label>
                        </div>
                    </section>
                </div>

                <section
                    className={styles.examples}
                    aria-labelledby="examples-title"
                >
                    <div className={styles.sectionHeading}>
                        <h2 id="examples-title">Estados para comparar</h2>
                        <p>
                            As amostras abaixo mantêm tamanho padrão e seguem o
                            estilo e a numeração escolhidos acima.
                        </p>
                    </div>
                    <div className={styles.exampleList}>
                        {examples.map((example) => (
                            <div className={styles.example} key={example.title}>
                                <div className={styles.exampleCell}>
                                    <CellImpressionView
                                        impression={example.impression}
                                        options={exampleOptions}
                                    />
                                </div>
                                <div>
                                    <h3>{example.title}</h3>
                                    <p>{example.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
