import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'
import './vendors/bootstrap/css/bootstrap.min.css'

import Home from './views/Home.tsx'
import Lessons from './views/modes/Lessons.tsx'
import Free from './views/modes/Free.tsx'
// import Lesson01 from './views/lessons/Lesson01.tsx'

import 'bootstrap/dist/js/bootstrap.bundle.js'
import NFree from './views/modes/NFree.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Home} />
                <Route path='/free' Component={NFree} />
                <Route path='/nfree' Component={NFree} />
                <Route path='/lessons' Component={Lessons} />
                {/* <Route path='/lesson-01' Component={Lesson01} /> */}
            </Routes>
        </BrowserRouter>
    </>
)