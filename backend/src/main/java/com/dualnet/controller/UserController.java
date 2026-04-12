package com.dualnet.controller;

import com.dualnet.model.User;
import com.dualnet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Verarbeitet HTTP-Anfragen für Nutzerprofile und Folgen/Entfolgen
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/{username} – Profil eines Nutzers anzeigen
    // Öffentlich zugänglich (kein JWT nötig)
    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }

    // GET /api/users/{username}/posts – Alle Posts eines Nutzers laden
    // Öffentlich zugänglich
    @GetMapping("/{username}/posts")
    public ResponseEntity<List<Map<String, Object>>> getUserPosts(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserPosts(username));
    }

    // POST /api/users/{username}/follow – Einem Nutzer folgen
    // JWT nötig
    @PostMapping("/{username}/follow")
    public ResponseEntity<Void> followUser(
            @PathVariable String username,
            @AuthenticationPrincipal User currentUser) {
        userService.followUser(username, currentUser.getId());
        // 200 OK ohne Inhalt zurückgeben
        return ResponseEntity.ok().build();
    }

    // DELETE /api/users/{username}/follow – Einem Nutzer entfolgen
    // JWT nötig
    @DeleteMapping("/{username}/follow")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable String username,
            @AuthenticationPrincipal User currentUser) {
        userService.unfollowUser(username, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
