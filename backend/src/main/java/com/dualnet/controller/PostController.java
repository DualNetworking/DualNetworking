package com.dualnet.controller;

import com.dualnet.dto.PostRequest;
import com.dualnet.model.User;
import com.dualnet.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Verarbeitet HTTP-Anfragen für Posts (Feed, erstellen, liken)
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // GET /api/posts – Alle Posts laden (der Feed)
    // Kein JWT nötig – öffentlich zugänglich
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFeed() {
        return ResponseEntity.ok(postService.getFeed());
    }

    // POST /api/posts – Neuen Post erstellen
    // JWT nötig: @AuthenticationPrincipal gibt den eingeloggten Nutzer zurück
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.createPost(request, currentUser.getId()));
    }

    // POST /api/posts/{id}/like – Post liken
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.likePost(id, currentUser.getId()));
    }

    // DELETE /api/posts/{id}/like – Like entfernen
    @DeleteMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> unlikePost(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.unlikePost(id, currentUser.getId()));
    }
}
