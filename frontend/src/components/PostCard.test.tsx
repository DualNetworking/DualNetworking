import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PostCard from './PostCard'
import type { Post } from '../types'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ userId: 'user-1' }),
}))

vi.mock('../api/posts', () => ({
  likePost: vi.fn(),
  unlikePost: vi.fn(),
}))

vi.mock('./CommentSection', () => ({
  default: () => <div>CommentSection</div>,
}))

const testPost: Post = {
  id: 'post-1',
  content: 'Testinhalt des Posts',
  imageUrl: '',
  authorId: 'author-1',
  authorUsername: 'autornutzer',
  likeCount: 3,
  likes: [],
  createdAt: '2026-01-01T10:00:00',
}

describe('PostCard', () => {
  test('UT-FE-03: Post-Inhalt und Autor werden angezeigt', () => {
    render(
      <MemoryRouter>
        <PostCard post={testPost} />
      </MemoryRouter>
    )
    expect(screen.getByText('Testinhalt des Posts')).toBeInTheDocument()
    expect(screen.getByText('autornutzer')).toBeInTheDocument()
  })

  test('UT-FE-04: Like-Button ist sichtbar', () => {
    render(
      <MemoryRouter>
        <PostCard post={testPost} />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /3/i })).toBeInTheDocument()
  })
})
