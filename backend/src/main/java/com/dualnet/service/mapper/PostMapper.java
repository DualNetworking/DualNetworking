package com.dualnet.service.mapper;

import com.dualnet.dto.PostResponse;
import com.dualnet.model.Post;
import com.dualnet.model.User;
import org.springframework.stereotype.Component;

// Wandelt ein Post-Modell in einen PostResponse um.
// Zentralisiert die Logik zum Anreichern mit dem Autor-Username (DRY).
@Component
public class PostMapper {

    private static final String UNKNOWN_AUTHOR = "Unbekannt";

    // Konvertiert ein Post-Modell in einen PostResponse.
    // author darf null sein, falls der Autor in der DB nicht (mehr) existiert.
    public PostResponse toResponse(Post post, User author) {
        return new PostResponse(
                post.getId(),
                post.getContent(),
                post.getImageUrl() != null ? post.getImageUrl() : "",
                post.getAuthorId(),
                resolveAuthorUsername(author),
                post.getLikes().size(),
                post.getLikes(),
                post.getCreatedAt().toString()
        );
    }

    private String resolveAuthorUsername(User author) {
        return author != null ? author.getUsername() : UNKNOWN_AUTHOR;
    }
}
