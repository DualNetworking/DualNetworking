package com.dualnet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Daten, die beim Schreiben eines Kommentars mitgeschickt werden
@Data
public class CommentRequest {

    // Kommentar darf nicht leer sein, max. 300 Zeichen
    @NotBlank(message = "Kommentar darf nicht leer sein")
    @Size(max = 300, message = "Kommentar darf maximal 300 Zeichen lang sein")
    private String content;
}
