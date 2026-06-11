import { useState } from 'react'
import { Link } from 'react-router-dom'
import { likePost, unlikePost, deletePost } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import CommentSection from './CommentSection'
import type { Post } from '../types'

interface Props {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (postId: string) => void;
}

function PostCard({ post, onUpdate, onDelete }: Props) {
  const { userId } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [liking, setLiking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isLiked = userId ? post.likes.includes(userId) : false
  const isOwnPost = userId === post.authorId

  const handleLike = async () => {
    if (!userId) return
    setLiking(true)
    try {
      const updatedPost = isLiked ? await unlikePost(post.id) : await likePost(post.id)
      onUpdate?.(updatedPost as Post)
    } catch {
      alert('Fehler beim Liken')
    } finally {
      setLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Beitrag wirklich löschen?')) return
    setDeleting(true)
    try {
      await deletePost(post.id)
      onDelete?.(post.id)
    } catch {
      alert('Fehler beim Löschen')
      setDeleting(false)
    }
  }

  const initial = post.authorUsername[0]?.toUpperCase()

  return (
    <article style={{ ...styles.card, opacity: deleting ? 0.5 : 1 }}>
      <div style={styles.header}>
        <Link to={`/profile/${post.authorUsername}`} style={styles.authorRow}>
          {post.authorAvatarUrl ? (
            <img src={post.authorAvatarUrl} alt="" style={styles.authorAvatarImg} />
          ) : (
            <span style={styles.authorAvatar}>{initial}</span>
          )}
          <span style={styles.authorName}>{post.authorUsername}</span>
        </Link>
        <div style={styles.headerRight}>
          <time style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}
          </time>
          {isOwnPost && (
            <button onClick={handleDelete} disabled={deleting} style={styles.deleteBtn} title="Beitrag löschen">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <p style={styles.content}>{post.content}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" style={styles.image} />
      )}

      <div style={styles.actions}>
        <button
          onClick={handleLike}
          disabled={liking || !userId}
          style={{ ...styles.actionBtn, ...(isLiked ? styles.actionBtnLiked : {}) }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? '#d64045' : 'none'} stroke={isLiked ? '#d64045' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{post.likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{ ...styles.actionBtn, ...(showComments ? styles.actionBtnActive : {}) }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Kommentare</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </article>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'opacity 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'inherit',
  },
  authorAvatarImg: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    border: '1.5px solid #fecaca',
  } as React.CSSProperties,
  authorAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#fdf0f0',
    color: '#d64045',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
    border: '1.5px solid #f5c0c0',
  } as React.CSSProperties,
  authorName: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#111827',
  },
  date: {
    color: '#9ca3af',
    fontSize: '13px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#d1d5db',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },
  content: {
    fontSize: '15px',
    lineHeight: '1.65',
    color: '#374151',
    marginBottom: '14px',
    whiteSpace: 'pre-wrap',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '14px',
    maxHeight: '400px',
    objectFit: 'cover',
    border: '1px solid #f3f4f6',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#6b7280',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '500',
    fontFamily: 'inherit',
  },
  actionBtnLiked: {
    color: '#d64045',
    borderColor: '#f5c0c0',
    backgroundColor: '#fdf0f0',
  },
  actionBtnActive: {
    color: '#374151',
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
}

export default PostCard
