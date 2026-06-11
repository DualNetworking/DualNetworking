package com.dualnet.controller;

import com.dualnet.dto.CommentRequest;
import com.dualnet.dto.ReplyResponse;
import com.dualnet.model.User;
import com.dualnet.service.ReplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;

    // GET /api/comments/{id}/replies – Alle Antworten zu einem Kommentar (öffentlich)
    @GetMapping("/{id}/replies")
    public ResponseEntity<List<ReplyResponse>> getReplies(@PathVariable String id) {
        return ResponseEntity.ok(replyService.getReplies(id));
    }

    // POST /api/comments/{id}/replies – Antwort schreiben (JWT nötig)
    @PostMapping("/{id}/replies")
    public ResponseEntity<ReplyResponse> addReply(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(replyService.addReply(id, request, currentUser.getId()));
    }

    // DELETE /api/comments/replies/{replyId} – Antwort löschen (nur eigene)
    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable String replyId,
            @AuthenticationPrincipal User currentUser) {
        replyService.deleteReply(replyId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
