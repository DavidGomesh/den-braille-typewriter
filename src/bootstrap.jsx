import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'
import './vendors/bootstrap/css/bootstrap.min.css'

import Home from './views/Home'
import Free from './views/modes/Free'

import 'bootstrap/dist/js/bootstrap.bundle.js'
import AudioProvider from './providers/AudioProvider'
import Challenge from './views/modes/Challenge'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <AudioProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/free" Component={Free} />
                    <Route path="/lessons" Component={Challenge} />
                </Routes>
            </HashRouter>
        </AudioProvider>
    </>,
)
