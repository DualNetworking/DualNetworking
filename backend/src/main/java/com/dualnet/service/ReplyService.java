package com.dualnet.service;

import com.dualnet.dto.CommentRequest;
import com.dualnet.dto.ReplyResponse;
import com.dualnet.model.Reply;
import com.dualnet.model.User;
import com.dualnet.repository.CommentRepository;
import com.dualnet.repository.ReplyRepository;
import com.dualnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public List<ReplyResponse> getReplies(String commentId) {
        ensureCommentExists(commentId);
        return replyRepository.findByCommentIdOrderByCreatedAtAsc(commentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ReplyResponse addReply(String commentId, CommentRequest request, String authorId) {
        ensureCommentExists(commentId);
        Reply reply = new Reply();
        reply.setCommentId(commentId);
        reply.setAuthorId(authorId);
        reply.setContent(request.getContent());
        Reply saved = replyRepository.save(reply);
        return toResponse(saved);
    }

    public void deleteReply(String replyId, String userId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Antwort nicht gefunden"));
        if (!reply.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Keine Berechtigung");
        }
        replyRepository.delete(reply);
    }

    private void ensureCommentExists(String commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kommentar nicht gefunden");
        }
    }

    private ReplyResponse toResponse(Reply reply) {
        User author = userRepository.findById(reply.getAuthorId()).orElse(null);
        String username = author != null ? author.getUsername() : "Unbekannt";
        return new ReplyResponse(
                reply.getId(),
                reply.getCommentId(),
                reply.getContent(),
                reply.getAuthorId(),
                username,
                reply.getCreatedAt().toString()
        );
    }
}
