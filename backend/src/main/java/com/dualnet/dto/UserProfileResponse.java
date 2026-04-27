package com.dualnet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Antwortobjekt für Profilanfragen. Enthält bewusst KEINEN passwordHash und KEINE E-Mail –
// nur Daten, die andere Nutzer sehen dürfen.
@Data
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String username;
    private String bio;
    private int followersCount;
    private int followingCount;
}
