package com.dualnet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Antwort nach erfolgreichem Login oder Registrierung
// Enthält den JWT-Token und grundlegende Nutzerdaten
@Data
@AllArgsConstructor
public class AuthResponse {

    // JWT-Token, der für alle weiteren Anfragen benötigt wird
    private String token;

    // ID des eingeloggten Nutzers
    private String userId;

    // Benutzername des eingeloggten Nutzers
    private String username;
}
