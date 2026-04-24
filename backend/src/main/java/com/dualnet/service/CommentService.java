package com.dualnet.service;

import com.dualnet.dto.CommentRequest;
import com.dualnet.dto.CommentResponse;
import com.dualnet.model.Comment;
import com.dualnet.model.User;
import com.dualnet.repository.CommentRepository;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Geschäftslogik für Kommentare: laden und erstellen.
// Refactoring: Map<String,Object> ersetzt; deleteComment (toter Code) entfernt;
// enrichComment-Logik in CommentMapper ausgelagert.
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    // ===== Öffentliche Integration-Methoden =====

    // Liefert alle Kommentare zu einem Post (älteste zuerst)
    public List<CommentResponse> getComments(String postId) {
        ensurePostExists(postId);
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::toResponseWithAuthor)
                .toList();
    }

    // Erstellt einen neuen Kommentar unter einem Post
    public CommentResponse addComment(String postId, CommentRequest request, String currentUserId) {
        ensurePostExists(postId);
        Comment newComment = buildComment(postId, request, currentUserId);
        Comment savedComment = commentRepository.save(newComment);
        return toResponseWithAuthor(savedComment);
    }

    // ===== Private Operationen =====

    private Comment buildComment(String postId, CommentRequest request, String authorId) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setAuthorId(authorId);
        comment.setContent(request.getContent());
        return comment;
    }

    private void ensurePostExists(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nicht gefunden");
        }
    }

    private CommentResponse toResponseWithAuthor(Comment comment) {
        User author = userRepository.findById(comment.getAuthorId()).orElse(null);
        return commentMapper.toResponse(comment, author);
    }
}
