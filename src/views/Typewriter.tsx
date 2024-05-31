import React, { KeyboardEvent, useEffect, useState } from 'react'

import { constVoid, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'

import { Set } from 'immutable'

import { codeToKey, defaultCodeKeyMap, defaultKeyEmptyStringMap, defaultKeysCellMap, DOTS, isDotKey, Key, keysToCell, keyToString } from '../domain/Key.ts'

import Keyboard from '../components/Keyboard.tsx'
import Output, { addText } from '../components/Output.tsx'

import { codeToActionKey, defaultCodeActionKeyMap } from '../domain/ActionKey.ts'
import { Cell, cellToString, defaultCellStringMap } from '../domain/Cell.ts'

import '../styles/views/Typewriter.css'

import useSound from 'use-sound'

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

import audio_u from '../audio/cells/u.mp3'
import audio_v from '../audio/cells/v.mp3'
import audio_x from '../audio/cells/x.mp3'
import audio_y from '../audio/cells/y.mp3'
import audio_z from '../audio/cells/z.mp3'
import audio_cedilha from '../audio/cells/cedilha.mp3'
import audio_e_agudo from '../audio/cells/e-agudo.mp3'
import audio_a_agudo from '../audio/cells/a-agudo.mp3'
import audio_e_crase from '../audio/cells/e-crase.mp3'
import audio_u_agudo from '../audio/cells/u-agudo.mp3'

import audio_a_circunflexo from '../audio/cells/a-circunflexo.mp3'
import audio_e_circunflexo from '../audio/cells/e-circunflexo.mp3'
import audio_i_crase from '../audio/cells/i-crase.mp3'
import audio_o_circunflexo from '../audio/cells/o-circunflexo.mp3'
import audio_u_crase from '../audio/cells/u-crase.mp3'
import audio_a_crase from '../audio/cells/a-crase.mp3'
import audio_n_til from '../audio/cells/n-til.mp3'
import audio_u_trema from '../audio/cells/u-trema.mp3'
import audio_o_til from '../audio/cells/o-til.mp3'
import audio_w from '../audio/cells/w.mp3'

import audio_virgula from '../audio/cells/virgula.mp3'
import audio_ponto_e_virgula from '../audio/cells/ponto-e-virgula.mp3'
import audio_dois_pontos from '../audio/cells/dois-pontos.mp3'
import audio_divisao from '../audio/cells/divisao.mp3'
import audio_interrogacao from '../audio/cells/interrogacao.mp3'
import audio_exclamacao from '../audio/cells/exclamacao.mp3'
import audio_igual from '../audio/cells/igual.mp3'
import audio_aspa from '../audio/cells/aspa.mp3'
import audio_asterisco from '../audio/cells/asterisco.mp3'
import audio_grau from '../audio/cells/grau.mp3'

import audio_i_agudo from '../audio/cells/i-agudo.mp3'
import audio_a_til from '../audio/cells/a-til.mp3'
import audio_o_agudo from '../audio/cells/o-agudo.mp3'
import audio_sinal_de_numero from '../audio/cells/sinal-de-numero.mp3'
import audio_ponto from '../audio/cells/ponto.mp3'
import audio_hifen from '../audio/cells/hifen.mp3'

import audio_circunflexo from '../audio/cells/circunflexo.mp3'
import audio_sinal_de_negacao from '../audio/cells/sinal-de-negacao.mp3'
import audio_barra from '../audio/cells/barra.mp3'
import audio_sinal_de_delimitador from '../audio/cells/sinal-de-delimitador.mp3'
import audio_sinal_de_maiusculo from '../audio/cells/sinal-de-maiusculo.mp3'
import audio_cifrao from '../audio/cells/cifrao.mp3'
import audio_apostrofo from '../audio/cells/apostrofo.mp3'

import { Map } from 'immutable'


export default function Typewriter() {

    const [currPressedKeys, setCurrPressedKeys] = useState(Set<Key>())
    const [pressedKeys, setPressedKeys] = useState(Set<Key>())

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
    const [play_audio_cedilha] = useSound(audio_cedilha)
    const [play_audio_e_agudo] = useSound(audio_e_agudo)
    const [play_audio_a_agudo] = useSound(audio_a_agudo)
    const [play_audio_e_crase] = useSound(audio_e_crase)
    const [play_audio_u_agudo] = useSound(audio_u_agudo)

    const [play_audio_a_circunflexo] = useSound(audio_a_circunflexo)
    const [play_audio_e_circunflexo] = useSound(audio_e_circunflexo)
    const [play_audio_i_crase] = useSound(audio_i_crase)
    const [play_audio_o_circunflexo] = useSound(audio_o_circunflexo)
    const [play_audio_u_crase] = useSound(audio_u_crase)
    const [play_audio_a_crase] = useSound(audio_a_crase)
    const [play_audio_n_til] = useSound(audio_n_til)
    const [play_audio_u_trema] = useSound(audio_u_trema)
    const [play_audio_o_til] = useSound(audio_o_til)
    const [play_audio_w] = useSound(audio_w)

    const [play_audio_virgula] = useSound(audio_virgula)
    const [play_audio_ponto_e_virgula] = useSound(audio_ponto_e_virgula)
    const [play_audio_dois_pontos] = useSound(audio_dois_pontos)
    const [play_audio_divisao] = useSound(audio_divisao)
    const [play_audio_interrogacao] = useSound(audio_interrogacao)
    const [play_audio_exclamacao] = useSound(audio_exclamacao)
    const [play_audio_igual] = useSound(audio_igual)
    const [play_audio_aspa] = useSound(audio_aspa)
    const [play_audio_asterisco] = useSound(audio_asterisco)
    const [play_audio_grau] = useSound(audio_grau)

    const [play_audio_i_agudo] = useSound(audio_i_agudo)
    const [play_audio_a_til] = useSound(audio_a_til)
    const [play_audio_o_agudo] = useSound(audio_o_agudo)
    const [play_audio_sinal_de_numero] = useSound(audio_sinal_de_numero)
    const [play_audio_ponto] = useSound(audio_ponto)
    const [play_audio_hifen] = useSound(audio_hifen)

    const [play_audio_circunflexo] = useSound(audio_circunflexo)
    const [play_audio_sinal_de_negacao] = useSound(audio_sinal_de_negacao)
    const [play_audio_barra] = useSound(audio_barra)
    const [play_audio_sinal_de_delimitador] = useSound(audio_sinal_de_delimitador)
    const [play_audio_sinal_de_maiusculo] = useSound(audio_sinal_de_maiusculo)
    const [play_audio_cifrao] = useSound(audio_cifrao)
    const [play_audio_apostrofo] = useSound(audio_apostrofo)

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
        [Cell.C12346,  play_audio_cedilha],
        [Cell.C123456, play_audio_e_agudo],
        [Cell.C12356,  play_audio_a_agudo],
        [Cell.C2346,   play_audio_e_crase],
        [Cell.C23456,  play_audio_u_agudo],

        [Cell.C16,     play_audio_a_circunflexo],
        [Cell.C126,    play_audio_e_circunflexo],
        [Cell.C146,    play_audio_i_crase],
        [Cell.C1456,   play_audio_o_circunflexo],
        [Cell.C156,    play_audio_u_crase],
        [Cell.C1246,   play_audio_a_crase],
        [Cell.C12456,  play_audio_n_til],
        [Cell.C1256,   play_audio_u_trema],
        [Cell.C246,    play_audio_o_til],
        [Cell.C2456,   play_audio_w],
    
        [Cell.C2,      play_audio_virgula],
        [Cell.C23,     play_audio_ponto_e_virgula],
        [Cell.C25,     play_audio_dois_pontos],
        [Cell.C256,    play_audio_divisao],
        [Cell.C26,     play_audio_interrogacao],
        [Cell.C235,    play_audio_exclamacao],
        [Cell.C2356,   play_audio_igual],
        [Cell.C236,    play_audio_aspa],
        [Cell.C35,     play_audio_asterisco],
        [Cell.C356,    play_audio_grau],
        
        [Cell.C34,     play_audio_i_agudo],
        [Cell.C345,    play_audio_a_til],
        [Cell.C346,    play_audio_o_agudo],
        [Cell.C3456,   play_audio_sinal_de_numero],
        [Cell.C3,      play_audio_ponto],
        [Cell.C36,     play_audio_hifen],
    
        [Cell.C4,      play_audio_circunflexo],
        [Cell.C45,     play_audio_sinal_de_negacao],
        [Cell.C456,    play_audio_barra],
        [Cell.C5,      play_audio_sinal_de_delimitador],
        [Cell.C46,     play_audio_sinal_de_maiusculo],
        [Cell.C56,     play_audio_cifrao],
        [Cell.C6,      play_audio_apostrofo],
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
        pipe(
            key,
            O.fromPredicate(_ => isDotKey(_)),
            O.fold(
                () => handleNonDotKeyPressed(key),
                () => handleDotKeyPressed(key),
            )
        )
    }

    function handleNonDotKeyPressed(key: Key): void {
        pipe(
            constVoid(),
            O.fromPredicate(_ => pressedKeys.isEmpty()),
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
        setCurrPressedKeys(currPressedKeys.add(key))
        setPressedKeys(pressedKeys.add(key))
    }

    function rejectKeyPressed(): void {
        return constVoid()
    }

    function keyReleased(event: KeyboardEvent<HTMLElement>): void {
        event.preventDefault()
        pipe(
            event.code,
            codeToKey(defaultCodeKeyMap),
            O.map(key =>
                setCurrPressedKeys(currPressedKeys.remove(key))
            )
        )
    }

    useEffect(() => {
        // currPressedKeys.map(_ => console.log(_))
        // console.log("CPS:", currPressedKeys.reduce((acc, k) => acc + k, ""))
        // console.log("PS:", pressedKeys.reduce((acc, k) => acc + k, ""))

        pipe(
            O.Do,
            O.bind('_',    () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
            O.bind('cell', () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
            O.fold(
                ()         => handleNonCellCharacter(),
                ({ cell }) => handleCellCharacter(cell)
            )
        )

        // pipe(
        //     O.Do,
        //     O.bind('_',             () => pipe(currPressedKeys, O.fromPredicate(_ => _.isEmpty()))),
        //     O.bind('cell',          () => pipe(pressedKeys, keysToCell(defaultKeysCellMap))),
        //     O.bind('text',  ({ cell }) => pipe(cell, cellToString(defaultCellStringMap))),
        //     O.bind('textArea',      () => getElementById('test') as Option<HTMLTextAreaElement>),
        //     O.map(({ textArea, text }) => {
        //         pipe(textArea, addText(text))
        //         setPressedKeys(pressedKeys.clear())
        //     })
        // )
    }, [currPressedKeys])

    function handleNonCellCharacter(): void {
        pipe(
            pressedKeys, 
            keyToString(defaultKeyEmptyStringMap),
            O.map(addTextToOutput)
        )
    }

    function handleCellCharacter(cell: Cell): void {
        pipe(
            cell, 
            cellToString(defaultCellStringMap),
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
        <main
            onKeyDown={ keyPressed }
            onKeyUp={ keyReleased }
            className='container d-flex flex-column justify-content-center align-items-center'>
            {/* <audio src='/assets/audio/cells/a.mp3'/> */}
            <Output />
            <Keyboard />
        </main>
    </>)
}