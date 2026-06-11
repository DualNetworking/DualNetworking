import { useState, useEffect } from 'react'
import { getComments, addComment, deleteComment, getReplies, addReply, deleteReply } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import type { Comment, Reply } from '../types'

interface Props {
  postId: string;
}

interface CommentWithReplies extends Comment {
  replies: Reply[];
  showReplies: boolean;
  loadingReplies: boolean;
  repliesLoaded: boolean;
}

function CommentSection({ postId }: Props) {
  const { isLoggedIn, userId } = useAuth()
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    getComments(postId)
      .then(data => setComments(data.map(c => ({ ...c, replies: [], showReplies: false, loadingReplies: false, repliesLoaded: false }))))
      .finally(() => setLoading(false))
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const comment = await addComment(postId, newComment.trim())
      setComments(prev => [...prev, { ...comment, replies: [], showReplies: false, loadingReplies: false, repliesLoaded: false }])
      setNewComment('')
    } catch {
      alert('Fehler beim Absenden des Kommentars')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch {
      alert('Kommentar konnte nicht gelöscht werden')
    }
  }

  const handleToggleReplies = async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId)
    if (!comment) return

    if (comment.showReplies) {
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, showReplies: false } : c))
      return
    }

    setComments(prev => prev.map(c => c.id === commentId ? { ...c, loadingReplies: true } : c))
    try {
      const replies = await getReplies(commentId)
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, replies, showReplies: replies.length > 0, loadingReplies: false, repliesLoaded: true } : c
      ))
    } catch {
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, loadingReplies: false, repliesLoaded: true } : c
      ))
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim()) return
    setSubmittingReply(true)
    try {
      const reply = await addReply(commentId, replyText.trim())
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, replies: [...c.replies, reply], showReplies: true } : c
      ))
      setReplyText('')
      setReplyingTo(null)
    } catch {
      alert('Fehler beim Absenden der Antwort')
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      await deleteReply(replyId)
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, replies: c.replies.filter(r => r.id !== replyId) } : c
      ))
    } catch {
      alert('Antwort konnte nicht gelöscht werden')
    }
  }

  if (loading) return (
    <div style={styles.container}>
      <p style={styles.muted}>Lädt...</p>
    </div>
  )

  return (
    <div style={styles.container}>
      {comments.length === 0 ? (
        <p style={styles.muted}>Noch keine Kommentare – schreib den ersten!</p>
      ) : (
        <div style={styles.list}>
          {comments.map(comment => (
            <div key={comment.id}>
              {/* Kommentar */}
              <div style={styles.commentRow}>
                <span style={styles.initials}>{comment.authorUsername[0]?.toUpperCase()}</span>
                <div style={styles.bubble}>
                  <span style={styles.bubbleAuthor}>{comment.authorUsername}</span>
                  <span style={styles.bubbleText}>{comment.content}</span>
                </div>
                {comment.authorId === userId && (
                  <button onClick={() => handleDeleteComment(comment.id)} style={styles.deleteBtn} title="Löschen">
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* Antwort-Aktionen */}
              <div style={styles.replyActions}>
                {isLoggedIn && (
                  <button
                    style={styles.replyToggle}
                    onClick={() => {
                      if (replyingTo === comment.id) {
                        setReplyingTo(null)
                        setReplyText('')
                      } else {
                        setReplyingTo(comment.id)
                        setReplyText('')
                      }
                    }}
                  >
                    Antworten
                  </button>
                )}
                {(!comment.repliesLoaded || comment.replies.length > 0) && (
                  <button
                    style={styles.replyToggle}
                    onClick={() => handleToggleReplies(comment.id)}
                  >
                    {comment.loadingReplies
                      ? '...'
                      : comment.showReplies
                      ? 'Antworten ausblenden'
                      : `${comment.replies.length > 0 ? comment.replies.length + ' ' : ''}Antworten anzeigen`}
                  </button>
                )}
              </div>

              {/* Eingabe für neue Antwort */}
              {replyingTo === comment.id && (
                <div style={styles.replyForm}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`@${comment.authorUsername} antworten...`}
                    maxLength={300}
                    style={styles.replyInput}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmitReply(comment.id)
                      }
                      if (e.key === 'Escape') {
                        setReplyingTo(null)
                        setReplyText('')
                      }
                    }}
                  />
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={submittingReply || !replyText.trim()}
                    style={styles.sendBtn}
                  >
                    Senden
                  </button>
                  <button
                    onClick={() => { setReplyingTo(null); setReplyText('') }}
                    style={styles.cancelBtn}
                  >
                    Abbrechen
                  </button>
                </div>
              )}

              {/* Antworten */}
              {comment.showReplies && (
                <div style={styles.replies}>
                  {comment.replies.length === 0 ? (
                    <p style={styles.muted}>Noch keine Antworten.</p>
                  ) : (
                    comment.replies.map(reply => (
                      <div key={reply.id} style={styles.replyRow}>
                        <span style={{ ...styles.initials, ...styles.replyInitials }}>{reply.authorUsername[0]?.toUpperCase()}</span>
                        <div style={{ ...styles.bubble, ...styles.replyBubble }}>
                          <span style={styles.bubbleAuthor}>{reply.authorUsername}</span>
                          <span style={styles.bubbleText}>{reply.content}</span>
                        </div>
                        {reply.authorId === userId && (
                          <button onClick={() => handleDeleteReply(comment.id, reply.id)} style={styles.deleteBtn} title="Löschen">
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Neuer Kommentar */}
      {isLoggedIn && (
        <form onSubmit={handleSubmitComment} style={styles.form}>
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Kommentar schreiben..."
            maxLength={300}
            style={styles.input}
          />
          <button type="submit" disabled={submitting || !newComment.trim()} style={styles.sendBtn}>
            Senden
          </button>
        </form>
      )}
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6',
  },
  muted: {
    color: '#9ca3af',
    fontSize: '13px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '14px',
  },
  commentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  initials: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
  } as React.CSSProperties,
  replyInitials: {
    width: '24px',
    height: '24px',
    fontSize: '10px',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '7px 11px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  replyBubble: {
    backgroundColor: '#f3f4f6',
  },
  bubbleAuthor: {
    fontWeight: '600',
    fontSize: '12px',
    color: '#111827',
  },
  bubbleText: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: '1.5',
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
    flexShrink: 0,
    marginTop: '4px',
    transition: 'color 0.15s',
  },
  replyActions: {
    display: 'flex',
    gap: '12px',
    paddingLeft: '36px',
    marginTop: '4px',
    marginBottom: '2px',
  },
  replyToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    padding: '0',
    fontFamily: 'inherit',
  },
  replyForm: {
    display: 'flex',
    gap: '6px',
    paddingLeft: '36px',
    marginTop: '6px',
    marginBottom: '4px',
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    padding: '6px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    backgroundColor: '#fafafa',
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit',
  },
  replies: {
    paddingLeft: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  replyRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '7px',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendBtn: {
    padding: '7px 14px',
    backgroundColor: '#d64045',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
  },
  cancelBtn: {
    padding: '7px 12px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
  },
}

export default CommentSection
