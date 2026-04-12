package com.dualnet.controller;

import com.dualnet.dto.AuthResponse;
import com.dualnet.dto.LoginRequest;
import com.dualnet.dto.RegisterRequest;
import com.dualnet.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Verarbeitet HTTP-Anfragen für Registrierung und Login
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register – Neuen Nutzer registrieren
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // @Valid prüft die Eingaben automatisch (z.B. E-Mail-Format, Mindestlängen)
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/login – Nutzer einloggen und JWT zurückgeben
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
