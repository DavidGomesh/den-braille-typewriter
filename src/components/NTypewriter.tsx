import React from 'react'
import KeyboardAudioProvider from './KeyboardAudioPlayer'
import NKeyboard from './NKeyboard'

export default function NTypewriter() {
    return (<>
        <div
            id='typewriter'
            className='container d-flex flex-column justify-content-center align-items-center'>
            {/* onKeyDown={ keyPressed }
            onKeyUp={ keyReleased } */}
            {/* <Output /> */}
            <KeyboardAudioProvider>
                <NKeyboard />
            </KeyboardAudioProvider>
        </div>
    </>)
}

/**
 * # Ao pressionar uma tecla
 * > Eh uma tecla mapeada?
 *   - Nao: nao faz nada
 *   - Sim:
 *     > Eh uma tecla de acao?
 *       - Sim: executa sua acao
 *       - Nao:
 *
 * 
 * 
 * 
 */
