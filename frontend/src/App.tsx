import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import CreatePostPage from './pages/CreatePostPage'
import Navbar from './components/Navbar'

// Hilfskomponente: Schützt Routen die Login erfordern
// Leitet nicht eingeloggte Nutzer zur Login-Seite weiter
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// Hauptkomponente: Definiert alle Seiten und deren URLs
function App() {
  const { isLoggedIn } = useAuth()

  return (
    <>
      {/* Navbar nur anzeigen wenn eingeloggt */}
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Öffentliche Seiten */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Geschützte Seiten – erfordern Login */}
        <Route path="/" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Unbekannte URLs zum Feed weiterleiten */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
