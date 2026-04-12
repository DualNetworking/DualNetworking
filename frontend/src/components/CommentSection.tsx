import { useState, useEffect } from 'react'
import { getComments, addComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import type { Comment } from '../types'

interface Props {
  postId: string;
}

// Zeigt Kommentare zu einem Post an und erlaubt neue Kommentare
function CommentSection({ postId }: Props) {
  const { isLoggedIn } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Kommentare beim ersten Laden der Komponente abrufen
  useEffect(() => {
    getComments(postId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [postId])

  // Neuen Kommentar absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const comment = await addComment(postId, newComment.trim())
      // Neuen Kommentar am Ende der Liste hinzufügen
      setComments(prev => [...prev, comment])
      setNewComment('')
    } catch {
      alert('Fehler beim Absenden des Kommentars')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p style={{ color: '#888', fontSize: '14px' }}>Kommentare laden...</p>

  return (
    <div style={styles.container}>
      {/* Kommentarliste */}
      {comments.length === 0 ? (
        <p style={styles.empty}>Noch keine Kommentare</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} style={styles.comment}>
            <strong style={styles.author}>{comment.authorUsername}</strong>
            <span style={styles.text}> {comment.content}</span>
          </div>
        ))
      )}

      {/* Eingabe für neuen Kommentar – nur für eingeloggte Nutzer */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Kommentar schreiben..."
            maxLength={300}
            style={styles.input}
          />
          <button type="submit" disabled={submitting || !newComment.trim()} style={styles.button}>
            Senden
          </button>
        </form>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' },
  empty: { color: '#888', fontSize: '14px' },
  comment: { marginBottom: '6px', fontSize: '14px' },
  author: { color: '#1a1a2e' },
  text: { color: '#333' },
  form: { display: 'flex', gap: '8px', marginTop: '10px' },
  input: {
    flex: 1,
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    padding: '6px 14px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
}

export default CommentSection
