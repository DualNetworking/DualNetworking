package com.dualnet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Konfigurationsklasse für Beans, die von mehreren Klassen genutzt werden
@Configuration
public class JwtConfig {

    // BCryptPasswordEncoder: Hasht Passwörter sicher
    // BCrypt fügt automatisch einen Salt hinzu → gleiche Passwörter haben verschiedene Hashes
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
