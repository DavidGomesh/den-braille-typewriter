import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './views/Home.tsx'

import "./vendors/bootstrap/css/bootstrap.min.css"

import "./styles/index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
)