import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../api/users'

function Navbar() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    if (!username) return
    getProfile(username)
      .then(p => setAvatarUrl(p.avatarUrl || ''))
      .catch(() => {})
  }, [username])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initial = username?.[0]?.toUpperCase()

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>DualNet</Link>

      <div style={styles.links}>
        <Link to="/create" style={styles.createLink}>
          <span style={styles.plus}>+</span> Post
        </Link>
        <Link to={`/profile/${username}`} style={styles.profileLink}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profilbild" style={styles.avatarImg} />
          ) : (
            <span style={styles.avatarFallback}>{initial}</span>
          )}
          {username}
        </Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Ausloggen</button>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: '56px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#d64045',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  createLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#1f2937',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#f3f4f6',
  },
  plus: {
    fontSize: '16px',
    lineHeight: 1,
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1f2937',
    textDecoration: 'none',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  avatarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    border: '1.5px solid #fecaca',
  } as React.CSSProperties,
  avatarFallback: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#d64045',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  } as React.CSSProperties,
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    padding: '5px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default Navbar
