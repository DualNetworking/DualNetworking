import { useState } from 'react'
import { Link } from 'react-router-dom'
import { likePost, unlikePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import CommentSection from './CommentSection'
import type { Post } from '../types'

interface Props {
  post: Post;
  // Callback wenn sich die Like-Zahl ändert (damit die Elternkomponente aktualisiert werden kann)
  onUpdate?: (updatedPost: Post) => void;
}

// Zeigt einen einzelnen Post mit Autor, Inhalt, Likes und Kommentaren an
function PostCard({ post, onUpdate }: Props) {
  const { userId } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [liking, setLiking] = useState(false)

  // Prüfen ob der aktuelle Nutzer diesen Post geliked hat
  const isLiked = userId ? post.likes.includes(userId) : false

  // Like hinzufügen oder entfernen
  const handleLike = async () => {
    if (!userId) return
    setLiking(true)
    try {
      const updatedPost = isLiked
        ? await unlikePost(post.id)
        : await likePost(post.id)
      onUpdate?.(updatedPost as Post)
    } catch {
      alert('Fehler beim Liken')
    } finally {
      setLiking(false)
    }
  }

  return (
    <div style={styles.card}>
      {/* Autor-Link zum Profil */}
      <div style={styles.header}>
        <Link to={`/profile/${post.authorUsername}`} style={styles.authorLink}>
          <strong>{post.authorUsername}</strong>
        </Link>
        <span style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString('de-DE')}
        </span>
      </div>

      {/* Post-Inhalt */}
      <p style={styles.content}>{post.content}</p>

      {/* Optionales Bild */}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post-Bild" style={styles.image} />
      )}

      {/* Aktions-Leiste: Likes und Kommentare */}
      <div style={styles.actions}>
        {/* Like-Schaltfläche */}
        <button onClick={handleLike} disabled={liking || !userId} style={{
          ...styles.actionButton,
          color: isLiked ? '#e94560' : '#666',
        }}>
          {isLiked ? '❤️' : '🤍'} {post.likeCount}
        </button>

        {/* Kommentar-Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={styles.actionButton}
        >
          💬 Kommentare {showComments ? '▲' : '▼'}
        </button>
      </div>

      {/* Kommentarbereich (wird ein-/ausgeblendet) */}
      {showComments && <CommentSection postId={post.id} />}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  authorLink: {
    color: '#1a1a2e',
    textDecoration: 'none',
  },
  date: {
    color: '#888',
    fontSize: '13px',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
    color: '#333',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '12px',
    maxHeight: '400px',
    objectFit: 'cover',
  },
  actions: {
    display: 'flex',
    gap: '16px',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#666',
    padding: '4px 8px',
    borderRadius: '6px',
  }
}

export default PostCard
