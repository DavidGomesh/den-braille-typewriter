import React from 'react'

import '../../styles/views/Lessons.css'
import { Link } from 'react-router-dom'

export default function Lessons() {
    return (<>
        <main className='container d-flex justify-content-center py-5'>
            <div className='' style={{width: '1000px'}}>
                <h1 className='mb-3' style={{ fontSize: '2.5rem' }}>Lições</h1>
                <div>Lições concluídas: 10</div>
                <div className='mb-3'>Lições restantes: 10</div>
                <div>Progresso: 50%</div>
                <div className="progress mb-3">
                    <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: '50%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
                <Link to='/'><button type="button" className="btn btn-primary">Voltar</button></Link>
            </div>
            <div className='d-flex justify-content-end flex-wrap '>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>

                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>
                <div className="card border-dark mb-3 me-3" style={{ maxWidth: '20rem' }}>
                    <div className="card-header">#01 - Comandos Básicos</div>
                    <div className="card-body">
                        <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum non eveniet voluptatum quos facilis vitae quis nam? Commodi vel necessitatibus aspernatur, fugit reprehenderit quos natus, cum magni quidem quia nulla!</p>
                        <button className='btn btn-outline-primary fw-bold mb-2'>Entrar</button>
                    </div>
                </div>

            </div>
        </main>
    </>)
}