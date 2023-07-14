import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Routing from './Routing.jsx'
import AuthProvider from './common/AuthProvider'
import GameProvider from './common/GameProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GameProvider>
        <Routing />
      </GameProvider>
    </AuthProvider>
  </React.StrictMode>,
)
