package com.dualnet.controller;

import com.dualnet.dto.PostResponse;
import com.dualnet.dto.UserProfileResponse;
import com.dualnet.model.User;
import com.dualnet.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Verarbeitet HTTP-Anfragen für Nutzerprofile und Folgen/Entfolgen.
// Nutzt UserProfileResponse + PostResponse statt Map<String,Object>.
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/{username} – Profil eines Nutzers (öffentlich)
    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }

    // GET /api/users/{username}/posts – Alle Posts eines Nutzers (öffentlich)
    @GetMapping("/{username}/posts")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserPosts(username));
    }

    // POST /api/users/{username}/follow – Einem Nutzer folgen (JWT nötig)
    @PostMapping("/{username}/follow")
    public ResponseEntity<Void> followUser(
            @PathVariable String username,
            @AuthenticationPrincipal User currentUser) {
        userService.followUser(username, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    // DELETE /api/users/{username}/follow – Einem Nutzer entfolgen (JWT nötig)
    @DeleteMapping("/{username}/follow")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable String username,
            @AuthenticationPrincipal User currentUser) {
        userService.unfollowUser(username, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
