import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import "./styles/index.css"
import "./vendors/bootstrap/css/bootstrap.min.css"

import Home from './views/Home.tsx'
import Lessons from './views/Lessons.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Home} />
                <Route path='/lessons' Component={Lessons} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)