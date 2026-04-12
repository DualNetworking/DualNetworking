import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'

// Seite zum Erstellen eines neuen Posts
function CreatePostPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')

    try {
      // Post erstellen und danach zum Feed weiterleiten
      await createPost(content.trim(), imageUrl.trim() || undefined)
      navigate('/')
    } catch {
      setError('Post konnte nicht erstellt werden. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  // Zeigt an wie viele der 500 Zeichen noch verbleiben
  const remainingChars = 500 - content.length

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Neuen Post erstellen</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Dein Beitrag</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Was möchtest du teilen?"
              required
              style={styles.textarea}
            />
            {/* Zeichenzähler – wird rot wenn weniger als 50 Zeichen verbleiben */}
            <span style={{ ...styles.counter, color: remainingChars < 50 ? '#c62828' : '#888' }}>
              {remainingChars} Zeichen verbleibend
            </span>
          </div>

          <div style={styles.field}>
            <label>Bild-URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/bild.jpg"
              style={styles.input}
            />
          </div>

          <div style={styles.buttons}>
            {/* Abbrechen – zurück zum Feed */}
            <button
              type="button"
              onClick={() => navigate('/')}
              style={styles.cancelButton}
            >
              Abbrechen
            </button>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              style={styles.submitButton}
            >
              {loading ? 'Wird veröffentlicht...' : 'Veröffentlichen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: { color: '#1a1a2e', marginBottom: '24px' },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  counter: { fontSize: '13px', alignSelf: 'flex-end' },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  }
}

export default CreatePostPage
