import { useState } from 'react'
import { followUser, unfollowUser } from '../api/users'
import { useAuth } from '../context/AuthContext'

interface Props {
  username: string;
  initiallyFollowing: boolean;
  onFollowChange?: (nowFollowing: boolean) => void;
}

function FollowButton({ username, initiallyFollowing, onFollowChange }: Props) {
  const { username: currentUsername } = useAuth()
  const [following, setFollowing] = useState(initiallyFollowing)
  const [loading, setLoading] = useState(false)

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
        padding: '7px 18px',
        backgroundColor: following ? 'white' : '#d64045',
        color: following ? '#d64045' : 'white',
        border: '1.5px solid #d64045',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {loading ? '...' : following ? 'Entfolgen' : 'Folgen'}
    </button>
  )
}

export default FollowButton
