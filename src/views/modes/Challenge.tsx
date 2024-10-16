import React, { useEffect, useState } from 'react'

import '../../styles/views/modes/Free.css'

import Typewriter from '../../components/Typewriter.tsx'
import { useAudioContext } from '../../providers/AudioProvider.tsx'
import { List, Map, Set } from 'immutable'
import { Cell } from '../../domain/Cell.ts'

export interface RandomWord {
    word: string,
    audioSrc: string, 
    cells: List<Cell>
}

export default function Challenge() {

    const { playChallengeModeInstructionsAudio, playWordAudio, playRightAnswer, playWrongAnswer } = useAudioContext()

    const [randomWord, setRandomWord] = useState<RandomWord>()

    function getNextRandomWord() {
        console.info('Get next random word')
        setRandomWord(getRandomWord())
    }

    function playRandomWordAudio() {
        if (randomWord) {
            console.info('Play word audio: ' + randomWord.word)
            playWordAudio(randomWord?.audioSrc)
        }
    }

    function verifyAnswer(typedCells: List<Cell>) {
        if (verifyTypedCells(typedCells)) {
            console.info('Right answer')
            playRightAnswer(() => {
                getNextRandomWord()
                playRandomWordAudio()
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
        getNextRandomWord()
        playChallengeModeInstructionsAudio(playRandomWordAudio)
    }, [])


    return (<>  
        <main>
            <Typewriter challengeMode={true} randomWord={randomWord} onEnterPressed={verifyAnswer} />
        </main>
    </>)
}

const wordsMap = Map([
    ["casa", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C14, Cell.C1, Cell.C234, Cell.C1])
    }],

    ["amor", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C1, Cell.C134, Cell.C135, Cell.C1235])
    }],

    ["feliz", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C124, Cell.C15, Cell.C123, Cell.C24, Cell.C1356])
    }],

    ["livro", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C123, Cell.C24, Cell.C1236, Cell.C1235, Cell.C135])
    }],

    ["braille", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C12, Cell.C1235, Cell.C1, Cell.C24, Cell.C123, Cell.C123, Cell.C15])
    }],

    ["flor", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C124, Cell.C123, Cell.C135, Cell.C1235])
    }],

    ["escola", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C15, Cell.C234, Cell.C14, Cell.C135, Cell.C123, Cell.C1])
    }],

    ["brasil", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C12, Cell.C1235, Cell.C1, Cell.C234, Cell.C24, Cell.C123])
    }],

    ["café", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C14, Cell.C1, Cell.C124, Cell.C15])
    }],

    ["natureza", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C1345, Cell.C1, Cell.C2345, Cell.C136, Cell.C1235, Cell.C15, Cell.C1356, Cell.C1])
    }],

    ["sol", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C234, Cell.C135, Cell.C123])
    }],

    ["estrela", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C15, Cell.C234, Cell.C2345, Cell.C1235, Cell.C15, Cell.C123, Cell.C1])
    }],

    ["computador", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C14, Cell.C135, Cell.C134, Cell.C1234, Cell.C136, Cell.C2345, Cell.C1, Cell.C145, Cell.C135, Cell.C1235])
    }],

    ["inclusão", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C24, Cell.C1345, Cell.C14, Cell.C123, Cell.C136, Cell.C234, Cell.C345, Cell.C135])
    }],

    ["aventura", {
        audioSrc: 'assets/audio/views/challenge/words/casa.mp3',
        cells: List([Cell.C1, Cell.C1236, Cell.C15, Cell.C1345, Cell.C2345, Cell.C136, Cell.C1235, Cell.C1])
    }],    
])

function getRandomWord() {
    const words = wordsMap.keySeq()
    const index = Math.floor(Math.random() * (words.size as number))

    const word = words.get(index) as string
    const entry = wordsMap.get(word)

    const obj = {
        word: word,
        audioSrc: entry?.audioSrc as string,
        cells: entry?.cells as List<Cell>,
    }

    console.info('Random word selected: ' + word)
    return obj
}
