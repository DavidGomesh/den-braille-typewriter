import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'
import './vendors/bootstrap/css/bootstrap.min.css'

import Home from './views/Home.tsx'
import Lessons from './views/modes/Lessons.tsx'
import Free from './views/modes/Free.tsx'

import 'bootstrap/dist/js/bootstrap.bundle.js'
import MenuAudioProvider from './providers/MenuAudioProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <MenuAudioProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' Component={Home} />
                    <Route path='/free' Component={Free} />
                    <Route path='/lessons' Component={Lessons} />
                </Routes>
            </BrowserRouter>
        </MenuAudioProvider>
    </>
)