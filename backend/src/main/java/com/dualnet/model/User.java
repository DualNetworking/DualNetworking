package com.dualnet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Speichert einen Nutzer in der MongoDB-Collection "users"
@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    // MongoDB generiert automatisch eine eindeutige ID
    @Id
    private String id;

    // Benutzername muss eindeutig sein (Index in MongoDB)
    @Indexed(unique = true)
    private String username;

    // E-Mail muss eindeutig sein
    @Indexed(unique = true)
    private String email;

    // Passwort wird als BCrypt-Hash gespeichert, niemals als Klartext
    private String passwordHash;

    // Kurze Beschreibung des Nutzers (optional)
    private String bio = "";

    // Liste der IDs von Nutzern, denen dieser Nutzer folgt
    private List<String> following = new ArrayList<>();

    // Liste der IDs von Nutzern, die diesem Nutzer folgen
    private List<String> followers = new ArrayList<>();

    // Zeitpunkt der Registrierung
    private LocalDateTime createdAt = LocalDateTime.now();
}
