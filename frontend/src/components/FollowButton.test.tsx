import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import FollowButton from './FollowButton'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ username: 'ichnutzer' }),
}))

vi.mock('../api/users', () => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}))

describe('FollowButton', () => {
  test('UT-FE-06: Zeigt "Entfolgen" wenn bereits gefolgt wird', () => {
    render(
      <FollowButton username="anderernutzer" initiallyFollowing={true} />
    )
    expect(screen.getByRole('button', { name: /entfolgen/i })).toBeInTheDocument()
  })
})
