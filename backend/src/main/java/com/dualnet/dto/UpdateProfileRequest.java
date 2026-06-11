package com.dualnet.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

// Eingabedaten für das Aktualisieren des eigenen Profils (Bio + Profilbild)
@Data
public class UpdateProfileRequest {

    @Size(max = 200, message = "Bio darf maximal 200 Zeichen lang sein")
    private String bio;

    // Base64-kodiertes Bild (Data-URL), z.B. "data:image/jpeg;base64,..."
    // Kein @NotBlank – Felder sind optional, null = nicht ändern
    private String avatarUrl;
}
