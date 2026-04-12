import { useState, useEffect } from 'react'
import { getFeed } from '../api/posts'
import PostCard from '../components/PostCard'
import type { Post } from '../types'

// Feed-Seite: Zeigt alle Posts chronologisch an
function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Posts beim Laden der Seite abrufen
  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setError('Feed konnte nicht geladen werden'))
      .finally(() => setLoading(false))
  }, [])

  // Post in der Liste aktualisieren (z.B. nach einem Like)
  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  if (loading) return <div style={styles.message}>Feed wird geladen...</div>
  if (error) return <div style={styles.error}>{error}</div>

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Feed</h2>

      {/* Hinweis wenn noch keine Posts vorhanden sind */}
      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p>Noch keine Posts vorhanden.</p>
          <p>Sei der Erste und <a href="/create">erstelle einen Post!</a></p>
        </div>
      ) : (
        // Liste aller Posts
        posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} />
        ))
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  heading: {
    color: '#1a1a2e',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#c62828',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }
}

export default FeedPage
