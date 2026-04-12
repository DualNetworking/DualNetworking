package com.dualnet.repository;

import com.dualnet.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// Spring Data generiert die Datenbankabfragen automatisch aus den Methodennamen
// Keine eigene Implementierung nötig!
public interface UserRepository extends MongoRepository<User, String> {

    // Sucht einen Nutzer anhand der E-Mail-Adresse (für Login)
    Optional<User> findByEmail(String email);

    // Sucht einen Nutzer anhand des Benutzernamens (für Profilseite)
    Optional<User> findByUsername(String username);

    // Prüft ob eine E-Mail bereits vergeben ist (für Registrierung)
    boolean existsByEmail(String email);

    // Prüft ob ein Benutzername bereits vergeben ist (für Registrierung)
    boolean existsByUsername(String username);
}
