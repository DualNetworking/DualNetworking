import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, getUserPosts, updateProfile } from '../api/users'
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

  // Edit-State
  const [editing, setEditing] = useState(false)
  const [bioInput, setBioInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setEditing(false)
    Promise.all([getProfile(username), getUserPosts(username)])
      .then(([profileData, postsData]) => {
        setProfile(profileData)
        setPosts(postsData)
        setBioInput(profileData.bio || '')
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Bild darf maximal 2 MB groß sein.')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      setSaving(true)
      setSaveError('')
      try {
        const updated = await updateProfile({ avatarUrl: base64 })
        setProfile(updated)
      } catch {
        setSaveError('Bild konnte nicht gespeichert werden.')
      } finally {
        setSaving(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveBio = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateProfile({ bio: bioInput })
      setProfile(updated)
      setEditing(false)
    } catch {
      setSaveError('Bio konnte nicht gespeichert werden.')
    } finally {
      setSaving(false)
    }
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

        {/* Avatar */}
        <div style={styles.avatarWrap}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Profilbild" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>{initial}</div>
          )}
          {isOwnProfile && (
            <>
              <button
                style={styles.avatarEditBtn}
                onClick={() => fileInputRef.current?.click()}
                title="Profilbild ändern"
                disabled={saving}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>

        {/* Profil-Info */}
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

          {/* Bio */}
          {isOwnProfile && editing ? (
            <div style={styles.bioEditWrap}>
              <textarea
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                maxLength={200}
                rows={3}
                style={styles.bioTextarea}
                placeholder="Schreib etwas über dich..."
                autoFocus
              />
              <div style={styles.bioEditActions}>
                <span style={styles.bioCounter}>{200 - bioInput.length} Zeichen</span>
                <button onClick={() => { setEditing(false); setBioInput(profile.bio || '') }} style={styles.cancelBtn}>Abbrechen</button>
                <button onClick={handleSaveBio} disabled={saving} style={styles.saveBtn}>
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
              {saveError && <p style={styles.saveError}>{saveError}</p>}
            </div>
          ) : (
            <div style={styles.bioRow}>
              <p style={styles.bio}>{profile.bio || (isOwnProfile ? 'Noch keine Bio.' : '')}</p>
              {isOwnProfile && (
                <button onClick={() => setEditing(true)} style={styles.bioEditInlineBtn} title="Bio bearbeiten">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {saveError && !editing && <p style={styles.saveError}>{saveError}</p>}

          {/* Stats */}
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
  page: { maxWidth: '640px', margin: '0 auto', padding: '28px 16px' },
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
    position: 'relative',
    flexShrink: 0,
  } as React.CSSProperties,
  avatarImg: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fecaca',
    display: 'block',
  },
  avatarPlaceholder: {
    width: '76px',
    height: '76px',
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
  avatarEditBtn: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  } as React.CSSProperties,
  profileInfo: { flex: 1, minWidth: 0 },
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
  bioRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    marginBottom: '14px',
  },
  bio: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: 0,
    flex: 1,
  },
  bioEditInlineBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '2px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  bioEditWrap: {
    marginBottom: '14px',
  },
  bioTextarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#111827',
    backgroundColor: '#fafafa',
    outline: 'none',
    resize: 'none',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  bioEditActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
  },
  bioCounter: { fontSize: '12px', color: '#9ca3af', marginRight: 'auto' },
  cancelBtn: {
    padding: '5px 12px',
    background: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#6b7280',
  },
  saveBtn: {
    padding: '5px 14px',
    backgroundColor: '#d64045',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  saveError: {
    fontSize: '13px',
    color: '#b91c1c',
    marginTop: '6px',
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
  statLabel: { fontSize: '12px', color: '#9ca3af', lineHeight: 1 },
  statDivider: { width: '1px', height: '28px', backgroundColor: '#e5e7eb' },
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
