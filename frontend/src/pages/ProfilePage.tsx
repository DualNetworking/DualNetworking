import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getUserPosts } from '../api/users'
import { useAuth } from '../context/AuthContext'
import FollowButton from '../components/FollowButton'
import PostCard from '../components/PostCard'
import type { User, Post } from '../types'

function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { username: currentUsername } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!username) return
    setLoading(true)
    Promise.all([getProfile(username), getUserPosts(username)])
      .then(([profileData, postsData]) => {
        setProfile(profileData)
        setPosts(postsData)
      })
      .catch(() => setError('Profil konnte nicht geladen werden'))
      .finally(() => setLoading(false))
  }, [username])

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.skeletonCard} />
    </div>
  )

  if (error || !profile) return (
    <div style={styles.page}>
      <div style={styles.errorBox}>{error || 'Profil nicht gefunden'}</div>
    </div>
  )

  const isOwnProfile = profile.username === currentUsername
  const initial = profile.username[0]?.toUpperCase()

  return (
    <div style={styles.page}>
      <div style={styles.profileCard}>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>{initial}</div>
        </div>

        <div style={styles.profileInfo}>
          <div style={styles.profileTop}>
            <h1 style={styles.username}>{profile.username}</h1>
            {!isOwnProfile && (
              <FollowButton
                username={profile.username}
                initiallyFollowing={false}
                onFollowChange={(nowFollowing) => {
                  setProfile(prev => prev ? {
                    ...prev,
                    followersCount: prev.followersCount + (nowFollowing ? 1 : -1)
                  } : null)
                }}
              />
            )}
          </div>

          {profile.bio && <p style={styles.bio}>{profile.bio}</p>}

          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statNum}>{posts.length}</span>
              <span style={styles.statLabel}>Beiträge</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>{profile.followersCount}</span>
              <span style={styles.statLabel}>Follower</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>{profile.followingCount}</span>
              <span style={styles.statLabel}>Folgt</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={styles.postsHeading}>Beiträge</h2>

      {posts.length === 0 ? (
        <div style={styles.empty}>Noch keine Beiträge vorhanden.</div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
        ))
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '28px 16px',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    flexShrink: 0,
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#fdf0f0',
    color: '#d64045',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    border: '2px solid #fecaca',
  } as React.CSSProperties,
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
  },
  username: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  bio: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '14px',
    lineHeight: '1.5',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '4px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statNum: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    lineHeight: 1,
  },
  statDivider: {
    width: '1px',
    height: '28px',
    backgroundColor: '#e5e7eb',
  },
  postsHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '14px',
  },
  skeletonCard: {
    height: '140px',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  errorBox: {
    padding: '16px',
    backgroundColor: '#fdf0f0',
    color: '#b91c1c',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid #fecaca',
  },
  empty: {
    textAlign: 'center',
    padding: '32px',
    color: '#9ca3af',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
  },
}

export default ProfilePage
