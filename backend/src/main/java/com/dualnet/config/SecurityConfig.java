package com.dualnet.config;

import com.dualnet.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// Konfiguriert welche Endpunkte öffentlich zugänglich sind und welche JWT brauchen
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF deaktivieren (nicht nötig bei stateless REST API mit JWT)
            .csrf(AbstractHttpConfigurer::disable)

            // CORS-Konfiguration aktivieren (erlaubt Anfragen vom Frontend)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Keine Sessions verwenden (stateless wegen JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Definieren welche Endpunkte JWT brauchen und welche nicht
            .authorizeHttpRequests(auth -> auth
                // Registrierung und Login sind ohne Token zugänglich
                .requestMatchers("/api/auth/**").permitAll()
                // Feed und Profile lesen ist ohne Token möglich
                .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/{id}/comments").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{username}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/{username}/posts").permitAll()
                // Alles andere braucht einen gültigen JWT-Token
                .anyRequest().authenticated()
            )

            // JWT-Filter vor dem Standard-Authentifizierungsfilter einfügen
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS: Erlaubt dem Frontend (localhost:5173) Anfragen an das Backend zu senden
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Vite Dev Server darf Anfragen senden
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // Alle gängigen HTTP-Methoden erlauben
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Alle Header erlauben (inkl. Authorization für JWT)
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
