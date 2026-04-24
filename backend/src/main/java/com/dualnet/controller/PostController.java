package com.dualnet.controller;

import com.dualnet.dto.PostRequest;
import com.dualnet.dto.PostResponse;
import com.dualnet.model.User;
import com.dualnet.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Verarbeitet HTTP-Anfragen für Posts (Feed, erstellen, liken).
// Nutzt PostResponse-DTO statt Map<String,Object> – typsichere API.
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // GET /api/posts – Alle Posts laden (öffentlich)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getFeed() {
        return ResponseEntity.ok(postService.getFeed());
    }

    // POST /api/posts – Neuen Post erstellen (JWT nötig)
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.createPost(request, currentUser.getId()));
    }

    // POST /api/posts/{id}/like – Post liken
    @PostMapping("/{id}/like")
    public ResponseEntity<PostResponse> likePost(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.likePost(id, currentUser.getId()));
    }

    // DELETE /api/posts/{id}/like – Like entfernen
    @DeleteMapping("/{id}/like")
    public ResponseEntity<PostResponse> unlikePost(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.unlikePost(id, currentUser.getId()));
    }
}
