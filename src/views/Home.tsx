import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'
import { useAudioContext } from '../providers/AudioProvider.tsx'

import '../styles/views/Home.css'

export default function Home() {

    const { playMainMenuAudio, playFreeModeAudio, playChallengeModeAudio, playAboutModeAudio } = useAudioContext()

    function handleBtnFreeModeFocused() {
        playFreeModeAudio()
    }

    function handleBtnChallengeModeFocused() {
        playChallengeModeAudio()
    }

    function handleBtnAboutFocused() {
        playAboutModeAudio()
    }

    useEffect(() => {
        playMainMenuAudio()
    }, [])

    return (<>
        <main className='container d-flex justify-content-center align-items-center'>
            <div className='text-center'>

                <h1 style={{fontSize: '5rem'}}>Máquina Den Braille</h1>

                <div className='d-flex flex-column align-items-center'>

                    <Link 
                        onFocus={handleBtnFreeModeFocused} 
                        to={'/free'} 
                        className='btn btn-outline-primary btn-lg fw-bold mb-2' 
                        style={{width: '300px'}}>
                            Modo livre
                    </Link>

                    <Link 
                        onFocus={handleBtnChallengeModeFocused} 
                        to='/lessons' 
                        className='btn btn-outline-primary btn-lg fw-bold mb-2' 
                        style={{width: '300px'}}>
                            Modo desafio
                    </Link>

                    {/* <button 
                        onFocus={handleBtnAboutFocused} 
                        className='btn btn-outline-primary btn-lg fw-bold mb-2' 
                        style={{width: '300px'}}>
                            Sobre
                    </button> */}
                </div>
            </div>
        </main>
    </>)
}