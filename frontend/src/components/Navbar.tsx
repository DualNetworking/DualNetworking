import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navigationsleiste – wird auf allen Seiten nach dem Login angezeigt
function Navbar() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  // Ausloggen und zur Login-Seite weiterleiten
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      {/* App-Logo/Name links – klickbar zurück zum Feed */}
      <Link to="/" style={styles.logo}>DualNet</Link>

      <div style={styles.links}>
        {/* Link zur Post-Erstellen-Seite */}
        <Link to="/create" style={styles.link}>+ Post</Link>

        {/* Link zum eigenen Profil */}
        <Link to={`/profile/${username}`} style={styles.link}>{username}</Link>

        {/* Ausloggen-Schaltfläche */}
        <button onClick={handleLogout} style={styles.button}>Ausloggen</button>
      </div>
    </nav>
  )
}

// Einfache inline-Styles für die Navbar
const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#e94560',
    textDecoration: 'none',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  }
}

export default Navbar
