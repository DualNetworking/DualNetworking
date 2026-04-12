package com.dualnet.service;

import com.dualnet.dto.AuthResponse;
import com.dualnet.dto.LoginRequest;
import com.dualnet.dto.RegisterRequest;
import com.dualnet.model.User;
import com.dualnet.repository.UserRepository;
import com.dualnet.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Enthält die Logik für Registrierung und Login
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Registriert einen neuen Nutzer und gibt einen JWT-Token zurück
    public AuthResponse register(RegisterRequest request) {
        // Prüfen ob E-Mail oder Benutzername bereits vergeben sind
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail ist bereits vergeben");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Benutzername ist bereits vergeben");
        }

        // Neuen Nutzer erstellen und Passwort hashen (niemals Klartext speichern!)
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Nutzer in der Datenbank speichern
        User savedUser = userRepository.save(user);

        // JWT-Token erstellen und zusammen mit Nutzerdaten zurückgeben
        String token = jwtUtil.generateToken(savedUser.getId());
        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername());
    }

    // Prüft Login-Daten und gibt bei Erfolg einen JWT-Token zurück
    public AuthResponse login(LoginRequest request) {
        // Nutzer anhand der E-Mail suchen
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "E-Mail oder Passwort falsch"));

        // Eingegebenes Passwort mit dem gespeicherten Hash vergleichen
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-Mail oder Passwort falsch");
        }

        // JWT-Token erstellen und zurückgeben
        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getUsername());
    }
}
