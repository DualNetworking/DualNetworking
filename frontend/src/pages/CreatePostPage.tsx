import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'

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
      await createPost(content.trim(), imageUrl.trim() || undefined)
      navigate('/')
    } catch {
      setError('Post konnte nicht erstellt werden. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  const remaining = 500 - content.length
  const isNearLimit = remaining < 50

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Neuen Beitrag erstellen</h1>

        {error && (
          <div style={styles.error}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Dein Beitrag</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Was möchtest du teilen?"
              required
              style={styles.textarea}
            />
            <span style={{ ...styles.counter, color: isNearLimit ? '#b91c1c' : '#9ca3af' }}>
              {remaining} Zeichen verbleibend
            </span>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Bild-URL <span style={styles.optional}>(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/bild.jpg"
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={styles.cancelBtn}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              style={styles.submitBtn}
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
    maxWidth: '640px',
    margin: '0 auto',
    padding: '28px 16px',
  },
  card: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.3px',
    marginBottom: '24px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fdf0f0',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  optional: {
    color: '#9ca3af',
    fontWeight: '400',
  },
  textarea: {
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    resize: 'vertical',
    fontFamily: 'inherit',
    color: '#111827',
    backgroundColor: '#fafafa',
    outline: 'none',
    lineHeight: '1.6',
  },
  counter: {
    fontSize: '12px',
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#111827',
    backgroundColor: '#fafafa',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    paddingTop: '4px',
  },
  cancelBtn: {
    padding: '9px 20px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '9px 24px',
    backgroundColor: '#d64045',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
}

export default CreatePostPage
