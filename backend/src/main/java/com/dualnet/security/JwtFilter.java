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

// Liest den JWT-Token aus dem Authorization-Header und authentifiziert
// den Nutzer für Spring Security, falls der Token gültig ist.
//
// Refactoring: doFilterInternal hat jetzt nur noch die Aufgabe der Orchestrierung.
// Die Detail-Schritte (Header lesen, Authentifizierung setzen) liegen in eigenen Methoden.
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractBearerToken(request);

        if (token != null && jwtUtil.isTokenValid(token)) {
            String userId = jwtUtil.extractUserId(token);
            authenticateUser(userId, request);
        }

        filterChain.doFilter(request, response);
    }

    // Extrahiert den reinen Token aus dem Authorization-Header.
    // Gibt null zurück, wenn kein Bearer-Token vorhanden ist.
    private String extractBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }
        return authHeader.substring(BEARER_PREFIX.length());
    }

    // Lädt den Nutzer und setzt ihn in den Spring Security Context.
    // Wenn die userId nicht (mehr) existiert, passiert einfach nichts –
    // die Anfrage wird dann unauthentifiziert weitergegeben.
    private void authenticateUser(String userId, HttpServletRequest request) {
        userRepository.findById(userId).ifPresent(user -> {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            Collections.emptyList()
                    );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        });
    }
}
