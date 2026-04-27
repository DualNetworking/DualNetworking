package com.dualnet.service.mapper;

import com.dualnet.dto.CommentResponse;
import com.dualnet.model.Comment;
import com.dualnet.model.User;
import org.springframework.stereotype.Component;

// Wandelt ein Comment-Modell in einen CommentResponse um.
// Zentralisiert die Logik zum Anreichern mit dem Autor-Username (DRY).
@Component
public class CommentMapper {

    private static final String UNKNOWN_AUTHOR = "Unbekannt";

    public CommentResponse toResponse(Comment comment, User author) {
        return new CommentResponse(
                comment.getId(),
                comment.getPostId(),
                comment.getContent(),
                comment.getAuthorId(),
                resolveAuthorUsername(author),
                comment.getCreatedAt().toString()
        );
    }

    private String resolveAuthorUsername(User author) {
        return author != null ? author.getUsername() : UNKNOWN_AUTHOR;
    }
}
