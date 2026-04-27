import axios from 'axios'
import type { Comment } from '../types'

// API-Funktionen für Kommentare

// Lädt alle Kommentare zu einem Post
export async function getComments(postId: string): Promise<Comment[]> {
  const response = await axios.get<Comment[]>(`/api/posts/${postId}/comments`)
  return response.data
}

// Fügt einen neuen Kommentar zu einem Post hinzu
export async function addComment(postId: string, content: string): Promise<Comment> {
  const response = await axios.post<Comment>(`/api/posts/${postId}/comments`, { content })
  return response.data
}


// Löscht einen Kommentare