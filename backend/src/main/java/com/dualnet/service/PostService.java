package com.dualnet.service;

import com.dualnet.dto.PostRequest;
import com.dualnet.model.Post;
import com.dualnet.model.User;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

// Enthält die Logik für Posts: erstellen, laden, liken
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Gibt alle Posts zurück (neueste zuerst) – das ist der Feed
    public List<Map<String, Object>> getFeed() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .map(this::enrichPost)
                .toList();
    }

    // Erstellt einen neuen Post für den eingeloggten Nutzer
    public Map<String, Object> createPost(PostRequest request, String currentUserId) {
        Post post = new Post();
        post.setAuthorId(currentUserId);
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        Post savedPost = postRepository.save(post);
        return enrichPost(savedPost);
    }

    // Fügt den Like eines Nutzers zu einem Post hinzu
    public Map<String, Object> likePost(String postId, String currentUserId) {
        Post post = findPostOrThrow(postId);

        // Nur liken wenn noch nicht geliked
        if (!post.getLikes().contains(currentUserId)) {
            post.getLikes().add(currentUserId);
            postRepository.save(post);
        }

        return enrichPost(post);
    }

    // Entfernt den Like eines Nutzers von einem Post
    public Map<String, Object> unlikePost(String postId, String currentUserId) {
        Post post = findPostOrThrow(postId);

        post.getLikes().remove(currentUserId);
        postRepository.save(post);

        return enrichPost(post);
    }

    // Hilfmethode: Post anhand ID laden oder 404 werfen
    private Post findPostOrThrow(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nicht gefunden"));
    }

    // Reichert einen Post mit Autorendaten an (damit das Frontend Benutzername anzeigen kann)
    // package-private damit UserService diese Methode nutzen kann
    Map<String, Object> enrichPost(Post post) {
        // Autor aus der Datenbank laden
        User author = userRepository.findById(post.getAuthorId())
                .orElse(null);

        String authorUsername = author != null ? author.getUsername() : "Unbekannt";

        return Map.of(
                "id", post.getId(),
                "content", post.getContent(),
                "imageUrl", post.getImageUrl() != null ? post.getImageUrl() : "",
                "authorId", post.getAuthorId(),
                "authorUsername", authorUsername,
                "likeCount", post.getLikes().size(),
                "likes", post.getLikes(),
                "createdAt", post.getCreatedAt().toString()
        );
    }
}
