package com.dualnet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Speichert einen Beitrag in der MongoDB-Collection "posts"
@Data
@NoArgsConstructor
@Document(collection = "posts")
public class Post {

    // Eindeutige ID, von MongoDB generiert
    @Id
    private String id;

    // ID des Nutzers, der diesen Post geschrieben hat
    private String authorId;

    // Text des Beitrags (max. 500 Zeichen, wird im Service geprüft)
    private String content;

    // Optionale Bild-URL (kann null sein)
    private String imageUrl;

    // Liste der IDs von Nutzern, die diesen Post geliked haben
    private List<String> likes = new ArrayList<>();

    // Zeitpunkt der Veröffentlichung
    private LocalDateTime createdAt = LocalDateTime.now();
}
