import axios from 'axios'
import type { Comment, Reply } from '../types'

export async function getComments(postId: string): Promise<Comment[]> {
  const response = await axios.get<Comment[]>(`/api/posts/${postId}/comments`)
  return response.data
}

export async function addComment(postId: string, content: string): Promise<Comment> {
  const response = await axios.post<Comment>(`/api/posts/${postId}/comments`, { content })
  return response.data
}

export async function deleteComment(commentId: string): Promise<void> {
  await axios.delete(`/api/posts/comments/${commentId}`)
}

export async function getReplies(commentId: string): Promise<Reply[]> {
  const response = await axios.get<Reply[]>(`/api/comments/${commentId}/replies`)
  return response.data
}

export async function addReply(commentId: string, content: string): Promise<Reply> {
  const response = await axios.post<Reply>(`/api/comments/${commentId}/replies`, { content })
  return response.data
}

export async function deleteReply(replyId: string): Promise<void> {
  await axios.delete(`/api/comments/replies/${replyId}`)
}