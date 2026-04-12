import axios from 'axios'
import type { Post } from '../types'

// API-Funktionen für Posts

// Lädt alle Posts (den Feed) – neueste zuerst
export async function getFeed(): Promise<Post[]> {
  const response = await axios.get<Post[]>('/api/posts')
  return response.data
}

// Erstellt einen neuen Post
export async function createPost(content: string, imageUrl?: string): Promise<Post> {
  const response = await axios.post<Post>('/api/posts', { content, imageUrl })
  return response.data
}

// Liked einen Post
export async function likePost(postId: string): Promise<Post> {
  const response = await axios.post<Post>(`/api/posts/${postId}/like`)
  return response.data
}

// Entfernt den Like von einem Post
export async function unlikePost(postId: string): Promise<Post> {
  const response = await axios.delete<Post>(`/api/posts/${postId}/like`)
  return response.data
}
