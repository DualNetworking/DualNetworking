package com.dualnet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Daten, die beim Login mitgeschickt werden müssen
@Data
public class LoginRequest {

    // E-Mail muss vorhanden und gültig sein
    @NotBlank(message = "E-Mail darf nicht leer sein")
    @Email(message = "Keine gültige E-Mail-Adresse")
    private String email;

    // Passwort muss vorhanden sein
    @NotBlank(message = "Passwort darf nicht leer sein")
    private String password;
}
