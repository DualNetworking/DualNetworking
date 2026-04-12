package com.dualnet.controller;

import com.dualnet.dto.CommentRequest;
import com.dualnet.model.User;
import com.dualnet.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Verarbeitet HTTP-Anfragen für Kommentare
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // GET /api/posts/{id}/comments – Alle Kommentare zu einem Post laden
    // Öffentlich zugänglich
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Map<String, Object>>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    // POST /api/posts/{id}/comments – Kommentar zu einem Post hinzufügen
    // JWT nötig
    @PostMapping("/{id}/comments")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(commentService.addComment(id, request, currentUser.getId()));
    }
}
