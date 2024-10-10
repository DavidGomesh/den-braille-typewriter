import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { constVoid, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

import { Map, Set } from 'immutable'

import { codeToKey, defaultCodeKeyMap, defaultKeyEmptyStringMap, defaultKeysCellMap, DOTS, isDotKey, Key, keysToCell, keyToString } from '../domain/Key.ts'

import Keyboard from './Keyboard.tsx'
import Output, { addText } from './Output.tsx'

import { codeToActionKey, defaultCodeActionKeyMap } from '../domain/ActionKey.ts'
import { Cell, cellToString, defaultCellStringMap } from '../domain/Cell.ts'

import useSound from 'use-sound'

import audio_key_pressed_1 from '../audio/keys/key-pressed-1.mp3'
import audio_key_pressed_2 from '../audio/keys/key-pressed-2.mp3'
import audio_key_pressed_3 from '../audio/keys/key-pressed-3.mp3'
import audio_key_pressed_4 from '../audio/keys/key-pressed-4.mp3'

import audio_espaco from '../audio/cells/espaco.mp3'

import audio_a from '../audio/cells/a.mp3'
import audio_b from '../audio/cells/b.mp3'
import audio_c from '../audio/cells/c.mp3'
import audio_d from '../audio/cells/d.mp3'
import audio_e from '../audio/cells/e.mp3'
import audio_f from '../audio/cells/f.mp3'
import audio_g from '../audio/cells/g.mp3'
import audio_h from '../audio/cells/h.mp3'
import audio_i from '../audio/cells/i.mp3'
import audio_j from '../audio/cells/j.mp3'

import audio_k from '../audio/cells/k.mp3'
import audio_l from '../audio/cells/l.mp3'
import audio_m from '../audio/cells/m.mp3'
import audio_n from '../audio/cells/n.mp3'
import audio_o from '../audio/cells/o.mp3'
import audio_p from '../audio/cells/p.mp3'
import audio_q from '../audio/cells/q.mp3'
import audio_r from '../audio/cells/r.mp3'
import audio_s from '../audio/cells/s.mp3'
import audio_t from '../audio/cells/t.mp3'

import audio_a_agudo from '../audio/cells/a-agudo.mp3'
import audio_cedilha from '../audio/cells/cedilha.mp3'
import audio_e_agudo from '../audio/cells/e-agudo.mp3'
import audio_e_crase from '../audio/cells/e-crase.mp3'
import audio_u_agudo from '../audio/cells/u-agudo.mp3'
import audio_u from '../audio/cells/u.mp3'
import audio_v from '../audio/cells/v.mp3'
import audio_x from '../audio/cells/x.mp3'
import audio_y from '../audio/cells/y.mp3'
import audio_z from '../audio/cells/z.mp3'

import audio_a_circunflexo from '../audio/cells/a-circunflexo.mp3'
import audio_a_crase from '../audio/cells/a-crase.mp3'
import audio_e_circunflexo from '../audio/cells/e-circunflexo.mp3'
import audio_i_crase from '../audio/cells/i-crase.mp3'
import audio_n_til from '../audio/cells/n-til.mp3'
import audio_o_circunflexo from '../audio/cells/o-circunflexo.mp3'
import audio_o_til from '../audio/cells/o-til.mp3'
import audio_u_crase from '../audio/cells/u-crase.mp3'
import audio_u_trema from '../audio/cells/u-trema.mp3'
import audio_w from '../audio/cells/w.mp3'

import audio_aspa from '../audio/cells/aspa.mp3'
import audio_asterisco from '../audio/cells/asterisco.mp3'
import audio_divisao from '../audio/cells/divisao.mp3'
import audio_dois_pontos from '../audio/cells/dois-pontos.mp3'
import audio_exclamacao from '../audio/cells/exclamacao.mp3'
import audio_grau from '../audio/cells/grau.mp3'
import audio_igual from '../audio/cells/igual.mp3'
import audio_interrogacao from '../audio/cells/interrogacao.mp3'
import audio_ponto_e_virgula from '../audio/cells/ponto-e-virgula.mp3'
import audio_virgula from '../audio/cells/virgula.mp3'

import audio_a_til from '../audio/cells/a-til.mp3'
import audio_hifen from '../audio/cells/hifen.mp3'
import audio_i_agudo from '../audio/cells/i-agudo.mp3'
import audio_o_agudo from '../audio/cells/o-agudo.mp3'
import audio_ponto from '../audio/cells/ponto.mp3'
import audio_sinal_de_numero from '../audio/cells/sinal-de-numero.mp3'

import audio_apostrofo from '../audio/cells/apostrofo.mp3'
import audio_barra from '../audio/cells/barra.mp3'
import audio_cifrao from '../audio/cells/cifrao.mp3'
import audio_circunflexo from '../audio/cells/circunflexo.mp3'
import audio_sinal_de_delimitador from '../audio/cells/sinal-de-delimitador.mp3'
import audio_sinal_de_maiusculo from '../audio/cells/sinal-de-maiusculo.mp3'
import audio_sinal_de_negacao from '../audio/cells/sinal-de-negacao.mp3'

export default function Typewriter({ updateKeyHistory = constVoid, updateTypedCells = constVoid }) {

    const backspaceRef = useRef()
    const enterRef = useRef()
    const spaceRef = useRef()
    const dot1Ref = useRef()
    const dot2Ref = useRef()
    const dot3Ref = useRef()
    const dot4Ref = useRef()
    const dot5Ref = useRef()
    const dot6Ref = useRef()

    const keyRefMap: Map<Key, any> = Map([
        [Key.BACKSPACE, backspaceRef],
        [Key.ENTER, enterRef],
        [Key.SPACE, spaceRef],
        [Key.DOT1, dot1Ref],
        [Key.DOT2, dot2Ref],
        [Key.DOT3, dot3Ref],
        [Key.DOT4, dot4Ref],
        [Key.DOT5, dot5Ref],
        [Key.DOT6, dot6Ref],
    ])

    function performKeyAnimation(key: Key): void {
        pipe(
            O.fromNullable(keyRefMap.get(key)),
            O.map(keyRef => {
                keyRef.current.classList.add('bg-dark')
                keyRef.current.classList.add('text-light')
            })
        )
    }

    function cancelKeyAnimation(key: Key): void {
        pipe(
            O.fromNullable(keyRefMap.get(key)),
            O.map(keyRef => {
                keyRef.current.classList.remove('bg-dark')
                keyRef.current.classList.remove('text-light')
            })
        )
    }

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

    const [play_key_pressed_1] = useSound(audio_key_pressed_1)
    const [play_key_pressed_2] = useSound(audio_key_pressed_2)
    const [play_key_pressed_3] = useSound(audio_key_pressed_3)
    const [play_key_pressed_4] = useSound(audio_key_pressed_4)

    const key_pressed_players = [
        play_key_pressed_1,
        play_key_pressed_2,
        play_key_pressed_3,
        play_key_pressed_4,
    ]

    function playKeyPressed() {
        const idx = Math.floor(Math.random() * key_pressed_players.length)
        key_pressed_players[idx]()
    }

    const [play_espaco] = useSound(audio_espaco)

    const [play_a] = useSound(audio_a)
    const [play_b] = useSound(audio_b)
    const [play_c] = useSound(audio_c)
    const [play_d] = useSound(audio_d)
    const [play_e] = useSound(audio_e)
    const [play_f] = useSound(audio_f)
    const [play_g] = useSound(audio_g)
    const [play_h] = useSound(audio_h)
    const [play_i] = useSound(audio_i)
    const [play_j] = useSound(audio_j)

    const [play_k] = useSound(audio_k)
    const [play_l] = useSound(audio_l)
    const [play_m] = useSound(audio_m)
    const [play_n] = useSound(audio_n)
    const [play_o] = useSound(audio_o)
    const [play_p] = useSound(audio_p)
    const [play_q] = useSound(audio_q)
    const [play_r] = useSound(audio_r)
    const [play_s] = useSound(audio_s)
    const [play_t] = useSound(audio_t)

    const [play_u] = useSound(audio_u)
    const [play_v] = useSound(audio_v)
    const [play_x] = useSound(audio_x)
    const [play_y] = useSound(audio_y)
    const [play_z] = useSound(audio_z)
    const [play_cedilha] = useSound(audio_cedilha)
    const [play_e_agudo] = useSound(audio_e_agudo)
    const [play_a_agudo] = useSound(audio_a_agudo)
    const [play_e_crase] = useSound(audio_e_crase)
    const [play_u_agudo] = useSound(audio_u_agudo)

    const [play_a_circunflexo] = useSound(audio_a_circunflexo)
    const [play_e_circunflexo] = useSound(audio_e_circunflexo)
    const [play_i_crase] = useSound(audio_i_crase)
    const [play_o_circunflexo] = useSound(audio_o_circunflexo)
    const [play_u_crase] = useSound(audio_u_crase)
    const [play_a_crase] = useSound(audio_a_crase)
    const [play_n_til] = useSound(audio_n_til)
    const [play_u_trema] = useSound(audio_u_trema)
    const [play_o_til] = useSound(audio_o_til)
    const [play_w] = useSound(audio_w)

    const [play_virgula] = useSound(audio_virgula)
    const [play_ponto_e_virgula] = useSound(audio_ponto_e_virgula)
    const [play_dois_pontos] = useSound(audio_dois_pontos)
    const [play_divisao] = useSound(audio_divisao)
    const [play_interrogacao] = useSound(audio_interrogacao)
    const [play_exclamacao] = useSound(audio_exclamacao)
    const [play_igual] = useSound(audio_igual)
    const [play_aspa] = useSound(audio_aspa)
    const [play_asterisco] = useSound(audio_asterisco)
    const [play_grau] = useSound(audio_grau)

    const [play_i_agudo] = useSound(audio_i_agudo)
    const [play_a_til] = useSound(audio_a_til)
    const [play_o_agudo] = useSound(audio_o_agudo)
    const [play_sinal_de_numero] = useSound(audio_sinal_de_numero)
    const [play_ponto] = useSound(audio_ponto)
    const [play_hifen] = useSound(audio_hifen)

    const [play_circunflexo] = useSound(audio_circunflexo)
    const [play_sinal_de_negacao] = useSound(audio_sinal_de_negacao)
    const [play_barra] = useSound(audio_barra)
    const [play_sinal_de_delimitador] = useSound(audio_sinal_de_delimitador)
    const [play_sinal_de_maiusculo] = useSound(audio_sinal_de_maiusculo)
    const [play_cifrao] = useSound(audio_cifrao)
    const [play_apostrofo] = useSound(audio_apostrofo)

    const cellPlayerMap: Map<Cell, any> = Map([
        [Cell.C0,      play_espaco],

        [Cell.C1,      play_a],
        [Cell.C12,     play_b],
        [Cell.C14,     play_c],
        [Cell.C145,    play_d],
        [Cell.C15,     play_e],
        [Cell.C124,    play_f],
        [Cell.C1245,   play_g],
        [Cell.C125,    play_h],
        [Cell.C24,     play_i],
        [Cell.C245,    play_j],

        [Cell.C13,     play_k],
        [Cell.C123,    play_l],
        [Cell.C134,    play_m],
        [Cell.C1345,   play_n],
        [Cell.C135,    play_o],
        [Cell.C1234,   play_p],
        [Cell.C12345,  play_q],
        [Cell.C1235,   play_r],
        [Cell.C234,    play_s],
        [Cell.C2345,   play_t],

        [Cell.C136,    play_u],
        [Cell.C1236,   play_v],
        [Cell.C1346,   play_x],
        [Cell.C13456,  play_y],
        [Cell.C1356,   play_z],
        [Cell.C12346,  play_cedilha],
        [Cell.C123456, play_e_agudo],
        [Cell.C12356,  play_a_agudo],
        [Cell.C2346,   play_e_crase],
        [Cell.C23456,  play_u_agudo],

        [Cell.C16,     play_a_circunflexo],
        [Cell.C126,    play_e_circunflexo],
        [Cell.C146,    play_i_crase],
        [Cell.C1456,   play_o_circunflexo],
        [Cell.C156,    play_u_crase],
        [Cell.C1246,   play_a_crase],
        [Cell.C12456,  play_n_til],
        [Cell.C1256,   play_u_trema],
        [Cell.C246,    play_o_til],
        [Cell.C2456,   play_w],

        [Cell.C2,      play_virgula],
        [Cell.C23,     play_ponto_e_virgula],
        [Cell.C25,     play_dois_pontos],
        [Cell.C256,    play_divisao],
        [Cell.C26,     play_interrogacao],
        [Cell.C235,    play_exclamacao],
        [Cell.C2356,   play_igual],
        [Cell.C236,    play_aspa],
        [Cell.C35,     play_asterisco],
        [Cell.C356,    play_grau],

        [Cell.C34,     play_i_agudo],
        [Cell.C345,    play_a_til],
        [Cell.C346,    play_o_agudo],
        [Cell.C3456,   play_sinal_de_numero],
        [Cell.C3,      play_ponto],
        [Cell.C36,     play_hifen],

        [Cell.C4,      play_circunflexo],
        [Cell.C45,     play_sinal_de_negacao],
        [Cell.C456,    play_barra],
        [Cell.C5,      play_sinal_de_delimitador],
        [Cell.C46,     play_sinal_de_maiusculo],
        [Cell.C56,     play_cifrao],
        [Cell.C6,      play_apostrofo],
    ])

    function playCellAudio(cell: Cell): void {
        pipe(
            O.fromNullable(cellPlayerMap.get(cell)),
            O.map(play => play())
        )
    }

    function getElementById(id: string): Option<HTMLElement> {
        return O.fromNullable(document.getElementById(id))
    }

    function keyPressed(event: KeyboardEvent<HTMLElement>): void {
        console.log(event.code)
        pipe(
            event.code,
            codeToActionKey(defaultCodeActionKeyMap),
            O.fold(
                () => handleNonActionKeyPressed(event),
                () => handleActionKeyPressed(),
            )
        )
    }

    function handleActionKeyPressed(): void {
        return constVoid()
    }

    function handleNonActionKeyPressed(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey(defaultCodeKeyMap),
            O.fold(
                ()  => handleNotMappedKeyPressed(),
                key => handleTypewriterKeyPressed(key)
            )
        )
    }

    function handleNotMappedKeyPressed(): void {
        return constVoid()
    }

    function handleTypewriterKeyPressed(key: Key): void {
        updateKeyHistory(key)
        performKeyAnimation(key)
        pipe(
            key,
            O.fromPredicate(isDotKey),
            O.fold(
                () => handleNonDotKeyPressed(key),
                () => handleDotKeyPressed(key),
            )
        )
    }

    function handleNonDotKeyPressed(key: Key): void {
        pipe(
            constVoid(),
            O.fromPredicate(pressedKeys.isEmpty),
            O.fold(
                () => rejectKeyPressed(),
                () => acceptKeyPressed(key)
            )
        )
    }

    function handleDotKeyPressed(key: Key): void {
        pipe(
            constVoid(),
            O.fromPredicate(_ => pressedKeys.isEmpty() || pressedKeysContainsDots()),
            O.fold(
                () => rejectKeyPressed(),
                () => acceptKeyPressed(key)
            )
        )
    }

    function pressedKeysContainsDots(): boolean {
        return DOTS.some(_ => pressedKeys.contains(_))
    }

    function acceptKeyPressed(key: Key): void {
        if (!pressedKeys.contains(key)) {
            playKeyPressed()
        }
        setCurrPressedKeys(currPressedKeys.add(key))
        setPressedKeys(pressedKeys.add(key))
        updateTypedCells(key)
    }

    function rejectKeyPressed(): void {
        return constVoid()
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey(defaultCodeKeyMap),
            O.map(key => {
                setCurrPressedKeys(currPressedKeys.remove(key))
                cancelKeyAnimation(key)
            })
        )
    }

    useEffect(() => {
        pipe(
            O.Do,
            O.bind('_',    () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
            O.bind('cell', () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
            O.fold(
                ()         => handleNonCellCharacter(),
                ({ cell }) => handleCellCharacter(cell)
            )
        )
    }, [currPressedKeys])

    function handleNonCellCharacter(): void {
        pipe(
            pressedKeys, keyToString(defaultKeyEmptyStringMap),
            O.map(addTextToOutput)
        )
    }

    function handleCellCharacter(cell: Cell): void {
        pipe(
            cell, cellToString(defaultCellStringMap),
            O.map(addTextToOutput),
            O.map(_ => playCellAudio(cell))
        )
    }

    function addTextToOutput(text: string): void {
        pipe(
            getElementById('test') as Option<HTMLTextAreaElement>,
            O.map(textArea => {
                pipe(textArea, addText(text))
                setPressedKeys(pressedKeys.clear())
            })
        )
    }

    return (<>
        <div
            id='typewriter'
            onKeyDown={ keyPressed }
            onKeyUp={ keyReleased }
            className='container d-flex flex-column justify-content-center align-items-center'>
            <Output />
            <Keyboard
                backspaceRef={backspaceRef}
                enterRef={enterRef}
                spaceRef={spaceRef}
                dot1Ref={dot1Ref}
                dot2Ref={dot2Ref}
                dot3Ref={dot3Ref}
                dot4Ref={dot4Ref}
                dot5Ref={dot5Ref}
                dot6Ref={dot6Ref}
            />
        </div>
    </>)
}