import axios from 'axios'
import type { User, Post } from '../types'

// API-Funktionen für Nutzerprofile und Folgen

// Lädt das Profil eines Nutzers anhand des Benutzernamens
export async function getProfile(username: string): Promise<User> {
  const response = await axios.get<User>(`/api/users/${username}`)
  return response.data
}

// Lädt alle Posts eines Nutzers
export async function getUserPosts(username: string): Promise<Post[]> {
  const response = await axios.get<Post[]>(`/api/users/${username}/posts`)
  return response.data
}

// Folgt einem Nutzer
export async function followUser(username: string): Promise<void> {
  await axios.post(`/api/users/${username}/follow`)
}

// Entfolgt einem Nutzer
export async function unfollowUser(username: string): Promise<void> {
  await axios.delete(`/api/users/${username}/follow`)
}
