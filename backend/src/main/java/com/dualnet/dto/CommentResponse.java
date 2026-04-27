package com.dualnet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Antwortobjekt für Kommentare. Ersetzt das vorherige Map<String, Object>.
// Der JSON-Output bleibt identisch.
@Data
@AllArgsConstructor
public class CommentResponse {

    private String id;
    private String postId;
    private String content;
    private String authorId;
    private String authorUsername;
    private String createdAt;
}
