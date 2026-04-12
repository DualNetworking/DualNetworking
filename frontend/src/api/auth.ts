import axios from 'axios'
import type { AuthResponse } from '../types'

// API-Funktionen für Authentifizierung

// Registriert einen neuen Nutzer und gibt Token + Nutzerdaten zurück
export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/api/auth/register', {
    username,
    email,
    password
  })
  return response.data
}

// Loggt einen Nutzer ein und gibt Token + Nutzerdaten zurück
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/api/auth/login', {
    email,
    password
  })
  return response.data
}
