package com.dualnet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

// Antwortobjekt für Posts. Ersetzt das vorherige Map<String, Object>.
// Der JSON-Output bleibt identisch, da Lombok @Data dieselben Feldnamen serialisiert.
@Data
@AllArgsConstructor
public class PostResponse {

    private String id;
    private String content;
    private String imageUrl;
    private String authorId;
    private String authorUsername;
    private int likeCount;
    private List<String> likes;
    private String createdAt;
}
