import React from 'react'

import '../styles/views/Home.css'
import { Link } from 'react-router-dom'

export default function Home() {
    return (<>
        <main className='container d-flex justify-content-center align-items-center'>
            <div className='text-center'>
                <h1 style={{fontSize: '5rem'}}>Máquina Den Braille</h1>
                <div className='d-flex flex-column align-items-center'>
                    <Link to={'/typewriter'}><button className='btn btn-outline-primary btn-lg fw-bold mb-2' style={{width: '300px'}}>Modo livre</button></Link>
                    <Link to='/lessons'><button className='btn btn-outline-primary btn-lg fw-bold mb-2' style={{width: '300px'}}>Modo lições</button></Link>
                    <button className='btn btn-outline-primary btn-lg fw-bold mb-2' style={{width: '300px'}}>Opções</button>
                    <button className='btn btn-outline-primary btn-lg fw-bold mb-2' style={{width: '300px'}}>Sobre</button>
                </div>
            </div>
        </main>
    </>)
}