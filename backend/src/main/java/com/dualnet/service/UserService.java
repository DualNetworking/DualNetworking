package com.dualnet.service;

import com.dualnet.model.User;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

// Enthält die Logik für Nutzerprofile und Folgen/Entfolgen
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    // Gibt das Profil eines Nutzers anhand des Benutzernamens zurück
    public Map<String, Object> getProfile(String username) {
        User user = findUserOrThrow(username);

        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "bio", user.getBio() != null ? user.getBio() : "",
                "followersCount", user.getFollowers().size(),
                "followingCount", user.getFollowing().size()
        );
    }

    // Gibt alle Posts eines Nutzers zurück (für die Profilseite)
    public List<Map<String, Object>> getUserPosts(String username) {
        User user = findUserOrThrow(username);

        return postRepository.findByAuthorIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(post -> postService.enrichPost(post))
                .toList();
    }

    // Lässt einen Nutzer einem anderen folgen
    public void followUser(String targetUsername, String currentUserId) {
        User target = findUserOrThrow(targetUsername);
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutzer nicht gefunden"));

        // Sich selbst folgen verhindern
        if (target.getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Du kannst dir nicht selbst folgen");
        }

        // Nur hinzufügen wenn noch nicht gefolgt wird
        if (!target.getFollowers().contains(currentUserId)) {
            target.getFollowers().add(currentUserId);
            currentUser.getFollowing().add(target.getId());

            // Beide Nutzer aktualisieren
            userRepository.save(target);
            userRepository.save(currentUser);
        }
    }

    // Lässt einen Nutzer einem anderen entfolgen
    public void unfollowUser(String targetUsername, String currentUserId) {
        User target = findUserOrThrow(targetUsername);
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutzer nicht gefunden"));

        target.getFollowers().remove(currentUserId);
        currentUser.getFollowing().remove(target.getId());

        userRepository.save(target);
        userRepository.save(currentUser);
    }

    // Hilfsmethode: Nutzer anhand Benutzername laden oder 404 werfen
    private User findUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Nutzer '" + username + "' nicht gefunden"));
    }
}
