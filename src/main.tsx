import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ChatPage from './pages/ChatPage.tsx'
import ReconocimientoPage from './pages/ReconocimientoPage.tsx'

function Root() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/chat') return <ChatPage />
  if (path === '/reconocimiento') return <ReconocimientoPage />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
