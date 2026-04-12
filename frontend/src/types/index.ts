// Zentrale TypeScript-Typdefinitionen für die gesamte Anwendung
// Alle Typen entsprechen den Antwortformaten des Backends

// Ein registrierter Nutzer
export interface User {
  id: string;
  username: string;
  bio: string;
  followersCount: number;
  followingCount: number;
}

// Ein Beitrag (Post)
export interface Post {
  id: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorUsername: string;
  likeCount: number;
  likes: string[];        // IDs der Nutzer die geliked haben
  createdAt: string;
}

// Ein Kommentar unter einem Post
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
}

// Antwort vom Backend nach Login/Registrierung
export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}
