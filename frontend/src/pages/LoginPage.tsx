import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(email, password)
      login(data.token, data.userId, data.username)
      navigate('/')
    } catch {
      setError('E-Mail oder Passwort falsch.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandName}>DualNet</span>
        </div>
        <h1 style={styles.title}>Willkommen zurück</h1>
        <p style={styles.subtitle}>Meld dich an und schau was es Neues gibt.</p>

        {error && (
          <div style={styles.error}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="du@beispiel.de"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Einloggen...' : 'Einloggen'}
          </button>
        </form>

        <p style={styles.switchText}>
          Noch kein Konto?{' '}
          <Link to="/register" style={styles.switchLink}>Jetzt registrieren</Link>
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
    backgroundColor: '#f5f4f0',
    padding: '24px 16px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 36px',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '400px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  brandDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#d64045',
    display: 'block',
  } as React.CSSProperties,
  brandName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#d64045',
    letterSpacing: '-0.3px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.4px',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '28px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fdf0f0',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#111827',
    backgroundColor: '#fafafa',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  button: {
    width: '100%',
    padding: '11px',
    backgroundColor: '#d64045',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background 0.15s',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  switchLink: {
    color: '#d64045',
    fontWeight: '500',
    textDecoration: 'none',
  },
}

export default LoginPage
