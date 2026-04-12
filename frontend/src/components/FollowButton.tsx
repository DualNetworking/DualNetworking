import { useState } from 'react'
import { followUser, unfollowUser } from '../api/users'
import { useAuth } from '../context/AuthContext'

interface Props {
  username: string;           // Benutzername des Zielprofils
  initiallyFollowing: boolean; // Folgt der aktuelle Nutzer bereits?
  onFollowChange?: (nowFollowing: boolean) => void; // Callback nach Änderung
}

// Schaltfläche zum Folgen oder Entfolgen eines Nutzers
function FollowButton({ username, initiallyFollowing, onFollowChange }: Props) {
  const { username: currentUsername } = useAuth()
  const [following, setFollowing] = useState(initiallyFollowing)
  const [loading, setLoading] = useState(false)

  // Nicht anzeigen für das eigene Profil
  if (username === currentUsername) return null

  const handleClick = async () => {
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(username)
        setFollowing(false)
        onFollowChange?.(false)
      } else {
        await followUser(username)
        setFollowing(true)
        onFollowChange?.(true)
      }
    } catch {
      alert('Fehler beim Folgen/Entfolgen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '8px 20px',
        backgroundColor: following ? 'white' : '#e94560',
        color: following ? '#e94560' : 'white',
        border: '2px solid #e94560',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      {/* Text je nach aktuellem Follow-Status */}
      {loading ? '...' : following ? 'Entfolgen' : 'Folgen'}
    </button>
  )
}

export default FollowButton
