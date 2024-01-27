import React from 'react'
import Typewriter from './Typewriter'

export default function App() {
    return (<>
        <div className='container py-5'>
            <h1>Hello, Typewriter!</h1>
            <Typewriter />
            <div className='border p-5 border-danger d-flex flex-wrap justify-content-center align-items-center'>
                <span className='braille border'>&nbsp;</span>
                <span className='braille border'>!</span>
                <span className='braille border'>"</span>
                <span className='braille border'>#</span>
                <span className='braille border'>$</span>
                <span className='braille border'>%</span>
                <span className='braille border'>&</span>
                <span className='braille border'>'</span>
                <span className='braille border'>(</span>
                <span className='braille border'>)</span>
                <span className='braille border'>*</span>
                <span className='braille border'>+</span>
                <span className='braille border'>,</span>
                <span className='braille border'>-</span>
                <span className='braille border'>.</span>
                <span className='braille border'>/</span>
                <span className='braille border'>0</span>
                <span className='braille border'>1</span>
                <span className='braille border'>2</span>
                <span className='braille border'>3</span>
                <span className='braille border'>4</span>
                <span className='braille border'>5</span>
                <span className='braille border'>6</span>
                <span className='braille border'>7</span>
                <span className='braille border'>8</span>
                <span className='braille border'>9</span>
                <span className='braille border'>:</span>
                <span className='braille border'>;</span>
                <span className='braille border'>&lt;</span>
                <span className='braille border'>=</span>
                <span className='braille border'>&gt;</span>
                <span className='braille border'>?</span>
                <span className='braille border'>@</span>
                <span className='braille border'>A</span>
                <span className='braille border'>B</span>
                <span className='braille border'>C</span>
                <span className='braille border'>D</span>
                <span className='braille border'>E</span>
                <span className='braille border'>F</span>
                <span className='braille border'>G</span>
                <span className='braille border'>H</span>
                <span className='braille border'>I</span>
                <span className='braille border'>J</span>
                <span className='braille border'>K</span>
                <span className='braille border'>L</span>
                <span className='braille border'>M</span>
                <span className='braille border'>N</span>
                <span className='braille border'>O</span>
                <span className='braille border'>P</span>
                <span className='braille border'>Q</span>
                <span className='braille border'>R</span>
                <span className='braille border'>S</span>
                <span className='braille border'>T</span>
                <span className='braille border'>U</span>
                <span className='braille border'>V</span>
                <span className='braille border'>W</span>
                <span className='braille border'>X</span>
                <span className='braille border'>Y</span>
                <span className='braille border'>Z</span>
                <span className='braille border'>[</span>
                <span className='braille border'>\</span>
                <span className='braille border'>]</span>
                <span className='braille border'>^</span>
                <span className='braille border'>_</span>
            </div>
        </div>
    </>)
}