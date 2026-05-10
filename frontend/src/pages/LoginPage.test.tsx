import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from './LoginPage'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}))

vi.mock('../api/auth', () => ({
  loginUser: vi.fn(),
}))

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  test('UT-FE-01: E-Mail- und Passwort-Felder sind sichtbar', () => {
    renderLoginPage()
    expect(screen.getByText('E-Mail')).toBeInTheDocument()
    expect(screen.getByText('Passwort')).toBeInTheDocument()
  })

  test('UT-FE-02: Einloggen-Button ist vorhanden', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /einloggen/i })).toBeInTheDocument()
  })
})
