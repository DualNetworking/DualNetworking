import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFeed, getFollowingFeed } from '../api/posts'
import { getUserPosts } from '../api/users'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import type { Post } from '../types'

type Tab = 'forYou' | 'following' | 'myPosts'

function FeedPage() {
  const { username } = useAuth()
  const [tab, setTab] = useState<Tab>('forYou')
  const [forYouPosts, setForYouPosts] = useState<Post[]>([])
  const [followingPosts, setFollowingPosts] = useState<Post[]>([])
  const [myPosts, setMyPosts] = useState<Post[]>([])
  const [loadingForYou, setLoadingForYou] = useState(true)
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [loadingMyPosts, setLoadingMyPosts] = useState(false)
  const [errorForYou, setErrorForYou] = useState('')
  const [errorFollowing, setErrorFollowing] = useState('')
  const [errorMyPosts, setErrorMyPosts] = useState('')
  const [followingLoaded, setFollowingLoaded] = useState(false)
  const [myPostsLoaded, setMyPostsLoaded] = useState(false)

  // For You beim ersten Laden
  useEffect(() => {
    getFeed()
      .then(setForYouPosts)
      .catch(() => setErrorForYou('Feed konnte nicht geladen werden'))
      .finally(() => setLoadingForYou(false))
  }, [])

  // Following-Feed beim ersten Tab-Wechsel laden
  useEffect(() => {
    if (tab === 'following' && !followingLoaded) {
      setLoadingFollowing(true)
      getFollowingFeed()
        .then(setFollowingPosts)
        .catch(() => setErrorFollowing('Feed konnte nicht geladen werden'))
        .finally(() => {
          setLoadingFollowing(false)
          setFollowingLoaded(true)
        })
    }
  }, [tab, followingLoaded])

  // Eigene Beiträge beim ersten Tab-Wechsel laden
  useEffect(() => {
    if (tab === 'myPosts' && !myPostsLoaded && username) {
      setLoadingMyPosts(true)
      getUserPosts(username)
        .then(setMyPosts)
        .catch(() => setErrorMyPosts('Beiträge konnten nicht geladen werden'))
        .finally(() => {
          setLoadingMyPosts(false)
          setMyPostsLoaded(true)
        })
    }
  }, [tab, myPostsLoaded, username])

  const handlePostUpdate = (updatedPost: Post) => {
    setForYouPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    setFollowingPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    setMyPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handlePostDelete = (postId: string) => {
    setForYouPosts(prev => prev.filter(p => p.id !== postId))
    setFollowingPosts(prev => prev.filter(p => p.id !== postId))
    setMyPosts(prev => prev.filter(p => p.id !== postId))
  }

  const posts = tab === 'forYou' ? forYouPosts : tab === 'following' ? followingPosts : myPosts
  const loading = tab === 'forYou' ? loadingForYou : tab === 'following' ? loadingFollowing : loadingMyPosts
  const error = tab === 'forYou' ? errorForYou : tab === 'following' ? errorFollowing : errorMyPosts

  return (
    <div style={styles.page}>
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === 'forYou' ? styles.tabActive : {}) }}
          onClick={() => setTab('forYou')}
        >
          Für dich
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'following' ? styles.tabActive : {}) }}
          onClick={() => setTab('following')}
        >
          Gefolgte
        </button>
        {username && (
          <button
            style={{ ...styles.tab, ...(tab === 'myPosts' ? styles.tabActive : {}) }}
            onClick={() => setTab('myPosts')}
          >
            Meine Beiträge
          </button>
        )}
      </div>

      {loading ? (
        <div style={styles.skeleton}>
          {[1, 2, 3].map(i => <div key={i} style={styles.skeletonCard} />)}
        </div>
      ) : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : posts.length === 0 ? (
        <div style={styles.empty}>
          {tab === 'following' ? (
            <>
              <p style={styles.emptyTitle}>Noch keine Beiträge</p>
              <p style={styles.emptyText}>Folge anderen Nutzern, um ihre Beiträge hier zu sehen.</p>
            </>
          ) : tab === 'myPosts' ? (
            <>
              <p style={styles.emptyTitle}>Noch keine eigenen Beiträge</p>
              <p style={styles.emptyText}>Erstelle deinen ersten <Link to="/create">Beitrag!</Link></p>
            </>
          ) : (
            <>
              <p style={styles.emptyTitle}>Noch nichts hier</p>
              <p style={styles.emptyText}>Sei der Erste und <Link to="/create">erstelle einen Beitrag!</Link></p>
            </>
          )}
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
    padding: '20px 16px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '20px',
    gap: '4px',
  },
  tab: {
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
  tabActive: {
    color: '#d64045',
    borderBottomColor: '#d64045',
  },
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skeletonCard: {
    height: '120px',
    backgroundColor: '#f3f4f6',
    borderRadius: '10px',
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
