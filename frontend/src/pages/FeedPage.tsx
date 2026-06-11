import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeed } from '../api/posts'
import PostCard from '../components/PostCard'
import type { Post } from '../types'

function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setError('Feed konnte nicht geladen werden'))
      .finally(() => setLoading(false))
  }, [])

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.skeleton}>
        {[1, 2, 3].map(i => <div key={i} style={styles.skeletonCard} />)}
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.page}>
      <div style={styles.errorBox}>{error}</div>
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Feed</h1>
        <span style={styles.count}>{posts.length} {posts.length === 1 ? 'Beitrag' : 'Beiträge'}</span>
      </div>

      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>Noch nichts hier</p>
          <p style={styles.emptyText}>Sei der Erste und <Link to="/create">erstelle einen Post!</Link></p>
        </div>
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
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.4px',
  },
  count: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
  },
  skeletonCard: {
    height: '120px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
    animation: 'pulse 1.5s ease-in-out infinite',
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
    padding: '48px 24px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
}

export default FeedPage
