import React, { useEffect, useRef } from 'react'
import useSound from 'use-sound'

import { Modal } from 'bootstrap'

import Typewriter from '../../components/Typewriter.tsx'

import '../../styles/views/lessons/Lesson01.css'

import audio_lesson_01_explanation from '../../audio/lessons/lesson01/lesson-01-explanation.mp3'

export default function Lesson01() {

    const btnAudio = useRef()

    const [play_lesson_01_explanation] = useSound(audio_lesson_01_explanation)

    // function playLesson01Explanation() {
    //     console.log(pause_lesson_01_explanation)
    //     lesson_01_explanation_is_playing ? pause_lesson_01_explanation() : play_lesson_01_explanation()
    // }

    // function playLesson01Explanation() {
    //     play_lesson_01_explanation()
    // }

    useEffect(() => {
        const modal = new Modal('#lesson-explanation')
        // play_lesson_01_explanation()
        modal.show()
    }, [])

    return (<>
        <main>
            <Typewriter />
        </main>

        <div className="modal" id='lesson-explanation' tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Lição 01</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body fs-5">
                        <p>A máquina Braille possui 6 teclas principais, que correspondem aos pontos 1, 2, 3, 4, 5 e 6 da cela Braille.</p>
                        <p>No seu teclado, as teclas F, D, S, J, K e L são usadas para representar essas teclas da máquina Braille.</p>
                        <p>Experimente pressionar a tecla F e soltá-la.</p>
                        <p>Repita o mesmo para as outras teclas (D, S, J, K e L).</p>
                        <p>Depois, experimente pressionar várias teclas simultaneamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" className="btn btn-primary" onClick={play_lesson_01_explanation}>Áudio</button>
                        {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                    </div>
                </div>
            </div>
        </div>
    </>)
}