package com.dualnet.controller;

import com.dualnet.dto.CommentRequest;
import com.dualnet.dto.CommentResponse;
import com.dualnet.model.User;
import com.dualnet.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Verarbeitet HTTP-Anfragen für Kommentare.
// Nutzt CommentResponse-DTO statt Map<String,Object>.
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // GET /api/posts/{id}/comments – Alle Kommentare zu einem Post (öffentlich)
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    // POST /api/posts/{id}/comments – Kommentar zu einem Post hinzufügen (JWT nötig)
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(commentService.addComment(id, request, currentUser.getId()));
    }
}
