package com.dualnet.service;

import com.dualnet.dto.PostRequest;
import com.dualnet.dto.PostResponse;
import com.dualnet.model.Post;
import com.dualnet.model.User;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Geschäftslogik für Posts: erstellen, laden, liken.
// Refactoring: Map<String,Object> durch PostResponse ersetzt; enrichPost in PostMapper ausgelagert.
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    // ===== Öffentliche Integration-Methoden =====

    // Liefert alle Posts für den Feed (neueste zuerst)
    public List<PostResponse> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponseWithAuthor)
                .toList();
    }

    // Erstellt einen neuen Post für den eingeloggten Nutzer
    public PostResponse createPost(PostRequest request, String currentUserId) {
        Post newPost = buildPost(request, currentUserId);
        Post savedPost = postRepository.save(newPost);
        return toResponseWithAuthor(savedPost);
    }

    // Fügt einen Like hinzu (idempotent – mehrfaches Liken ändert nichts)
    public PostResponse likePost(String postId, String currentUserId) {
        Post post = findPostOrThrow(postId);
        addLikeIfMissing(post, currentUserId);
        Post savedPost = postRepository.save(post);
        return toResponseWithAuthor(savedPost);
    }

    // Entfernt einen Like (idempotent)
    public PostResponse unlikePost(String postId, String currentUserId) {
        Post post = findPostOrThrow(postId);
        post.getLikes().remove(currentUserId);
        Post savedPost = postRepository.save(post);
        return toResponseWithAuthor(savedPost);
    }

    // Liefert alle Posts eines bestimmten Autors (für Profilseite).
    // Ersetzt die vorherige package-private enrichPost-Hintertür für UserService.
    public List<PostResponse> getPostsByAuthor(String authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId)
                .stream()
                .map(this::toResponseWithAuthor)
                .toList();
    }

    // ===== Private Operationen (jeweils eine Aufgabe, eine Abstraktionsebene) =====

    private Post buildPost(PostRequest request, String authorId) {
        Post post = new Post();
        post.setAuthorId(authorId);
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        return post;
    }

    private void addLikeIfMissing(Post post, String userId) {
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
        }
    }

    private Post findPostOrThrow(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Post nicht gefunden"));
    }

    private PostResponse toResponseWithAuthor(Post post) {
        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        return postMapper.toResponse(post, author);
    }
}
