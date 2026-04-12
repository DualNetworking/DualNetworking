package com.dualnet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Daten, die bei der Registrierung mitgeschickt werden müssen
@Data
public class RegisterRequest {

    // Benutzername: 3-20 Zeichen
    @NotBlank(message = "Benutzername darf nicht leer sein")
    @Size(min = 3, max = 20, message = "Benutzername muss zwischen 3 und 20 Zeichen lang sein")
    private String username;

    // Gültige E-Mail-Adresse
    @NotBlank(message = "E-Mail darf nicht leer sein")
    @Email(message = "Keine gültige E-Mail-Adresse")
    private String email;

    // Passwort: mindestens 6 Zeichen
    @NotBlank(message = "Passwort darf nicht leer sein")
    @Size(min = 6, message = "Passwort muss mindestens 6 Zeichen lang sein")
    private String password;
}
