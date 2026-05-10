import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from './Navbar'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ username: 'testnutzer', logout: vi.fn() }),
}))

describe('Navbar', () => {
  test('UT-FE-07: Logout-Button ist sichtbar', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /ausloggen/i })).toBeInTheDocument()
    expect(screen.getByText('testnutzer')).toBeInTheDocument()
  })
})
