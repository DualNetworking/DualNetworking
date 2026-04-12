package com.dualnet.security;

import com.dualnet.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

// Dieser Filter läuft bei JEDER HTTP-Anfrage und prüft den JWT-Token
// Wenn der Token gültig ist, wird der Nutzer in Spring Security eingetragen
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Authorization-Header lesen (Format: "Bearer <token>")
        String authHeader = request.getHeader("Authorization");

        // Wenn kein Token vorhanden, Anfrage ohne Authentifizierung weitergeben
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // "Bearer " (7 Zeichen) entfernen, um den reinen Token zu bekommen
        String token = authHeader.substring(7);

        // Token prüfen und wenn gültig, Nutzer authentifizieren
        if (jwtUtil.isTokenValid(token)) {
            String userId = jwtUtil.extractUserId(token);

            // Nutzer aus der Datenbank laden
            userRepository.findById(userId).ifPresent(user -> {
                // Authentifizierungsobjekt für Spring Security erstellen
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,           // Nutzer-Objekt (als Principal)
                                null,           // Kein Passwort nötig (bereits durch Token geprüft)
                                Collections.emptyList() // Keine Rollen/Berechtigungen
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Nutzer in Spring Security Context eintragen
                // Danach weiß Spring Security wer diese Anfrage stellt
                SecurityContextHolder.getContext().setAuthentication(authentication);
            });
        }

        // Anfrage an den nächsten Filter / Controller weitergeben
        filterChain.doFilter(request, response);
    }
}
