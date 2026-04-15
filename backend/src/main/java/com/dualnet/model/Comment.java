package com.dualnet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

// Speichert einen Kommentar in der MongoDB-Collection "comments"
@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {

    // Eindeutige ID, von MongoDB generiert
    @Id
    private String id;

    // ID des Posts, zu dem dieser Kommentar gehört
    private String postId;

    // ID des Nutzers, der den Kommentar geschrieben hat
    private String authorId;

    // Text des Kommentars (max. 300 Zeichen)
    private String content;

    // Zeitpunkt des Kommentars
    private LocalDateTime createdAt = LocalDateTime.now();
}


