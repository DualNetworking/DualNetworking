import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import CommentSection from './CommentSection'
import type { Comment } from '../types'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: true }),
}))

vi.mock('../api/comments', () => ({
  getComments: vi.fn().mockResolvedValue([
    {
      id: 'c-1',
      postId: 'post-1',
      content: 'Super Post!',
      authorId: 'a-1',
      authorUsername: 'kommentarnutzer',
      createdAt: '2026-01-01T10:00:00',
    } as Comment,
  ]),
  addComment: vi.fn(),
}))

describe('CommentSection', () => {
  test('UT-FE-05: Kommentare werden angezeigt', async () => {
    render(<CommentSection postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('Super Post!')).toBeInTheDocument()
    })
    expect(screen.getByText('kommentarnutzer')).toBeInTheDocument()
  })
})
