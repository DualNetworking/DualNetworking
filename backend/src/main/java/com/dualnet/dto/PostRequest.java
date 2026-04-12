package com.dualnet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Daten, die beim Erstellen eines Posts mitgeschickt werden
@Data
public class PostRequest {

    // Inhalt des Posts: darf nicht leer sein, max. 500 Zeichen
    @NotBlank(message = "Post-Inhalt darf nicht leer sein")
    @Size(max = 500, message = "Post darf maximal 500 Zeichen lang sein")
    private String content;

    // Optionale Bild-URL (kann null sein)
    private String imageUrl;
}
