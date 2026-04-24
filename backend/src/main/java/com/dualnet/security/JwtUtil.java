package com.dualnet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// Hilfsklasse für alle JWT-Operationen: Token erstellen und lesen.
@Component
public class JwtUtil {

    // Geheimschlüssel aus application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Ablaufzeit in Millisekunden aus application.properties
    @Value("${jwt.expiration}")
    private long expiration;

    // Erstellt den Signatur-Schlüssel aus dem konfigurierten Secret
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Erstellt einen neuen JWT-Token für den gegebenen Nutzer
    public String generateToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // Liest die Nutzer-ID aus einem validen Token
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    // Prüft ob der Token gültig (korrekte Signatur + nicht abgelaufen) ist
    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            // Ungültige Signatur, abgelaufen oder falsches Format → ungültig
            return false;
        }
    }

    // Liest alle Claims (Inhalte) aus dem Token
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
