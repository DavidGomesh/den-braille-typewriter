import React, { useEffect, useRef, useState } from 'react'

import '../../styles/views/modes/Challenge.css'

import { List, Map } from 'immutable'
import Typewriter from '../../components/Typewriter'
import { Cell, stringToCellList } from '../../domain/Cell'
import { useAudioContext } from '../../providers/AudioProvider'

export interface RandomWord {
    word: string
    cells: List<Cell>
}

export default function Challenge() {
    const {
        playChallengeModeInstructionsAudio,
        playHowToAccessInstructionsAudio,
        playWordAudio,
        playRightAnswer,
        playWrongAnswer,
        stopAllAudio,
    } = useAudioContext()

    const output = useRef<HTMLTextAreaElement>(null)
    const [randomWord, setRandomWord] = useState<RandomWord>(getRandomWord)
    const initialWord = useRef(randomWord)

    function getNextRandomWord() {
        console.info('Get next random word')
        setRandomWord(getRandomWord())
    }

    function playRandomWordAudio() {
        console.info('Play word audio: ' + randomWord.word)
        playWordAudio(randomWord.word)
    }

    function verifyAnswer(outputValue: string) {
        const typedCells = stringToCellList(outputValue)
        if (verifyTypedCells(typedCells)) {
            console.info('Right answer')
            playRightAnswer(() => {
                ;(output.current as HTMLTextAreaElement).value = ''
                getNextRandomWord()
            })
        } else {
            console.info('Wrong answer')
            playWrongAnswer()
        }
    }

    function verifyTypedCells(typedCells: List<Cell>) {
        console.log(typedCells)
        console.log(randomWord?.cells)
        if (typedCells.equals(randomWord?.cells as List<Cell>)) {
            console.info('Typed cells is equals to word cells')
            return true
        } else {
            console.info('Typed cells is not equals to word cells')
            return false
        }
    }

    useEffect(() => {
        playHowToAccessInstructionsAudio(() =>
            playWordAudio(initialWord.current.word),
        )
        return stopAllAudio
    }, [playHowToAccessInstructionsAudio, playWordAudio, stopAllAudio])

    return (
        <>
            <main>
                <Typewriter
                    challengeMode={true}
                    randomWord={randomWord}
                    outputReference={output}
                    onEnterPressed={verifyAnswer}
                    onInstructionsKeyPressed={() => {
                        playChallengeModeInstructionsAudio()
                    }}
                    onRepeatWordKeyPressed={() => {
                        playRandomWordAudio()
                    }}
                />
            </main>
        </>
    )
}

const wordsMap = Map([
    [
        'casa',
        {
            cells: List([Cell.C14, Cell.C1, Cell.C234, Cell.C1]),
        },
    ],

    [
        'amor',
        {
            cells: List([Cell.C1, Cell.C134, Cell.C135, Cell.C1235]),
        },
    ],

    [
        'feliz',
        {
            cells: List([Cell.C124, Cell.C15, Cell.C123, Cell.C24, Cell.C1356]),
        },
    ],

    [
        'livro',
        {
            cells: List([
                Cell.C123,
                Cell.C24,
                Cell.C1236,
                Cell.C1235,
                Cell.C135,
            ]),
        },
    ],

    [
        'braille',
        {
            cells: List([
                Cell.C12,
                Cell.C1235,
                Cell.C1,
                Cell.C24,
                Cell.C123,
                Cell.C123,
                Cell.C15,
            ]),
        },
    ],

    [
        'flor',
        {
            cells: List([Cell.C124, Cell.C123, Cell.C135, Cell.C1235]),
        },
    ],

    [
        'escola',
        {
            cells: List([
                Cell.C15,
                Cell.C234,
                Cell.C14,
                Cell.C135,
                Cell.C123,
                Cell.C1,
            ]),
        },
    ],

    [
        'brasil',
        {
            cells: List([
                Cell.C12,
                Cell.C1235,
                Cell.C1,
                Cell.C234,
                Cell.C24,
                Cell.C123,
            ]),
        },
    ],

    [
        'café',
        {
            cells: List([Cell.C14, Cell.C1, Cell.C124, Cell.C123456]),
        },
    ],

    [
        'natureza',
        {
            cells: List([
                Cell.C1345,
                Cell.C1,
                Cell.C2345,
                Cell.C136,
                Cell.C1235,
                Cell.C15,
                Cell.C1356,
                Cell.C1,
            ]),
        },
    ],

    [
        'sol',
        {
            cells: List([Cell.C234, Cell.C135, Cell.C123]),
        },
    ],

    [
        'estrela',
        {
            cells: List([
                Cell.C15,
                Cell.C234,
                Cell.C2345,
                Cell.C1235,
                Cell.C15,
                Cell.C123,
                Cell.C1,
            ]),
        },
    ],

    [
        'computador',
        {
            cells: List([
                Cell.C14,
                Cell.C135,
                Cell.C134,
                Cell.C1234,
                Cell.C136,
                Cell.C2345,
                Cell.C1,
                Cell.C145,
                Cell.C135,
                Cell.C1235,
            ]),
        },
    ],

    [
        'inclusão',
        {
            cells: List([
                Cell.C24,
                Cell.C1345,
                Cell.C14,
                Cell.C123,
                Cell.C136,
                Cell.C234,
                Cell.C345,
                Cell.C135,
            ]),
        },
    ],

    [
        'aventura',
        {
            cells: List([
                Cell.C1,
                Cell.C1236,
                Cell.C15,
                Cell.C1345,
                Cell.C2345,
                Cell.C136,
                Cell.C1235,
                Cell.C1,
            ]),
        },
    ],
])

function getRandomWord() {
    const words = wordsMap.keySeq()
    const index = Math.floor(Math.random() * (words.size as number))

    const word = words.get(index) as string
    const entry = wordsMap.get(word)

    const obj = {
        word: word,
        cells: entry?.cells as List<Cell>,
    }

    console.info('Random word selected: ' + word)
    return obj
}
