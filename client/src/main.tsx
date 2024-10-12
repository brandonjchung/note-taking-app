import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import { UserProvider } from './components/UserContext.tsx'

import App from './App.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <UserProvider>
            <App/>
        </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
