import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'

// Einstiegspunkt der React-Anwendung
// Hängt die App in das <div id="root"> in der index.html ein
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter: aktiviert client-seitiges Routing mit der URL-Leiste */}
    <BrowserRouter>
      {/* AuthProvider: stellt Login-Zustand für alle Komponenten bereit */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
