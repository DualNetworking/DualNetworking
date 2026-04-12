import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

// Registrierungsseite – neuer Nutzer gibt Benutzername, E-Mail und Passwort ein
function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Registrieren und direkt einloggen
      const data = await registerUser(username, email, password)
      login(data.token, data.userId, data.username)
      navigate('/') // Zum Feed weiterleiten
    } catch (err: unknown) {
      // Fehlermeldung vom Backend anzeigen wenn vorhanden
      if (err instanceof Error) {
        setError(err.message || 'Registrierung fehlgeschlagen. Bitte erneut versuchen.')
      } else {
        setError('Registrierung fehlgeschlagen. Bitte erneut versuchen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>DualNet</h1>
        <h2 style={styles.subtitle}>Konto erstellen</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Benutzername (3–20 Zeichen)</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              minLength={3}
              maxLength={20}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Passwort (min. 6 Zeichen)</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Konto erstellen...' : 'Konto erstellen'}
          </button>
        </form>

        <p style={styles.switchText}>
          Bereits ein Konto? <Link to="/login">Einloggen</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: { color: '#e94560', margin: '0 0 4px 0', textAlign: 'center' },
  subtitle: { color: '#333', margin: '0 0 24px 0', textAlign: 'center', fontWeight: 'normal' },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px' },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  switchText: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }
}

export default RegisterPage
