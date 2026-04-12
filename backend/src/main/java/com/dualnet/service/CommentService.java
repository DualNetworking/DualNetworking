package com.dualnet.service;

import com.dualnet.dto.CommentRequest;
import com.dualnet.model.Comment;
import com.dualnet.model.User;
import com.dualnet.repository.CommentRepository;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

// Enthält die Logik für Kommentare: laden und erstellen
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Gibt alle Kommentare zu einem Post zurück (älteste zuerst)
    public List<Map<String, Object>> getComments(String postId) {
        // Prüfen ob der Post existiert
        postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nicht gefunden"));

        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::enrichComment)
                .toList();
    }

    // Erstellt einen neuen Kommentar unter einem Post
    public Map<String, Object> addComment(String postId, CommentRequest request, String currentUserId) {
        // Prüfen ob der Post existiert
        postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nicht gefunden"));

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setAuthorId(currentUserId);
        comment.setContent(request.getContent());

        Comment savedComment = commentRepository.save(comment);
        return enrichComment(savedComment);
    }

    // Reichert einen Kommentar mit dem Benutzernamen des Autors an
    private Map<String, Object> enrichComment(Comment comment) {
        User author = userRepository.findById(comment.getAuthorId()).orElse(null);
        String authorUsername = author != null ? author.getUsername() : "Unbekannt";

        return Map.of(
                "id", comment.getId(),
                "postId", comment.getPostId(),
                "content", comment.getContent(),
                "authorId", comment.getAuthorId(),
                "authorUsername", authorUsername,
                "createdAt", comment.getCreatedAt().toString()
        );
    }
}
