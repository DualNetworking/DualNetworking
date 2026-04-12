import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getUserPosts } from '../api/users'
import { useAuth } from '../context/AuthContext'
import FollowButton from '../components/FollowButton'
import PostCard from '../components/PostCard'
import type { User, Post } from '../types'

// Profilseite: Zeigt Nutzerprofil und dessen Posts
function ProfilePage() {
  // Benutzername aus der URL lesen (z.B. /profile/max → username = "max")
  const { username } = useParams<{ username: string }>()
  const { username: currentUsername } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Profil und Posts laden wenn sich der Benutzername ändert
  useEffect(() => {
    if (!username) return

    setLoading(true)
    Promise.all([
      getProfile(username),
      getUserPosts(username)
    ])
      .then(([profileData, postsData]) => {
        setProfile(profileData)
        setPosts(postsData)
      })
      .catch(() => setError('Profil konnte nicht geladen werden'))
      .finally(() => setLoading(false))
  }, [username])

  // Post nach Like aktualisieren
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  if (loading) return <div style={styles.message}>Profil wird geladen...</div>
  if (error || !profile) return <div style={styles.error}>{error || 'Profil nicht gefunden'}</div>

  // Prüfen ob dies das eigene Profil ist (FollowButton wird dann nicht angezeigt)
  const isOwnProfile = profile.username === currentUsername

  return (
    <div style={styles.page}>
      {/* Profilkarte */}
      <div style={styles.profileCard}>
        {/* Avatar (einfach: erster Buchstabe des Benutzernamens) */}
        <div style={styles.avatar}>
          {profile.username[0].toUpperCase()}
        </div>

        <div style={styles.profileInfo}>
          <h2 style={styles.username}>{profile.username}</h2>
          {profile.bio && <p style={styles.bio}>{profile.bio}</p>}

          {/* Follower-Statistiken */}
          <div style={styles.stats}>
            <span><strong>{profile.followersCount}</strong> Follower</span>
            <span><strong>{profile.followingCount}</strong> Follows</span>
            <span><strong>{posts.length}</strong> Posts</span>
          </div>

          {/* Folgen-Schaltfläche (nur für fremde Profile) */}
          {!isOwnProfile && (
            <div style={{ marginTop: '12px' }}>
              <FollowButton
                username={profile.username}
                initiallyFollowing={false}
                onFollowChange={(nowFollowing) => {
                  // Follower-Zahl im Profil aktualisieren
                  setProfile(prev => prev ? {
                    ...prev,
                    followersCount: prev.followersCount + (nowFollowing ? 1 : -1)
                  } : null)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Posts des Nutzers */}
      <h3 style={styles.postsHeading}>Posts von {profile.username}</h3>
      {posts.length === 0 ? (
        <div style={styles.empty}>Noch keine Posts vorhanden.</div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
        ))
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: '680px', margin: '0 auto', padding: '24px 16px' },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#e94560',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  username: { margin: '0 0 6px 0', color: '#1a1a2e' },
  bio: { color: '#555', margin: '0 0 12px 0' },
  stats: { display: 'flex', gap: '20px', color: '#666', fontSize: '14px' },
  postsHeading: { color: '#1a1a2e', marginBottom: '12px' },
  message: { textAlign: 'center', padding: '40px', color: '#666' },
  error: { textAlign: 'center', padding: '40px', color: '#c62828' },
  empty: {
    textAlign: 'center',
    padding: '30px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }
}

export default ProfilePage
