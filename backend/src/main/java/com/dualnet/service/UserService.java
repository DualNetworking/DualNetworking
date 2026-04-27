package com.dualnet.service;

import com.dualnet.dto.PostResponse;
import com.dualnet.dto.UserProfileResponse;
import com.dualnet.model.User;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Geschäftslogik für Profile und Folgen/Entfolgen.
// Refactoring: IOSP angewendet – öffentliche Methoden sind reine Integration,
// die eigentliche Listen-Manipulation liegt in privaten Operationen.
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PostService postService;

    // ===== Öffentliche Integration-Methoden =====

    public UserProfileResponse getProfile(String username) {
        User user = findUserByUsernameOrThrow(username);
        return userMapper.toProfileResponse(user);
    }

    public List<PostResponse> getUserPosts(String username) {
        User user = findUserByUsernameOrThrow(username);
        return postService.getPostsByAuthor(user.getId());
    }

    public void followUser(String targetUsername, String currentUserId) {
        User target = findUserByUsernameOrThrow(targetUsername);
        User currentUser = findUserByIdOrThrow(currentUserId);
        ensureNotSelfFollow(target.getId(), currentUserId);
        addFollowRelationship(target, currentUser);
        persistBoth(target, currentUser);
    }

    public void unfollowUser(String targetUsername, String currentUserId) {
        User target = findUserByUsernameOrThrow(targetUsername);
        User currentUser = findUserByIdOrThrow(currentUserId);
        removeFollowRelationship(target, currentUser);
        persistBoth(target, currentUser);
    }

    // ===== Private Operationen (eine Aufgabe, eine Abstraktionsebene) =====

    // Operation: reine Listen-Manipulation, keine Repository-Aufrufe
    private void addFollowRelationship(User target, User currentUser) {
        if (target.getFollowers().contains(currentUser.getId())) {
            return;
        }
        target.getFollowers().add(currentUser.getId());
        currentUser.getFollowing().add(target.getId());
    }

    private void removeFollowRelationship(User target, User currentUser) {
        target.getFollowers().remove(currentUser.getId());
        currentUser.getFollowing().remove(target.getId());
    }

    private void persistBoth(User target, User currentUser) {
        userRepository.save(target);
        userRepository.save(currentUser);
    }

    private void ensureNotSelfFollow(String targetId, String currentUserId) {
        if (targetId.equals(currentUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Du kannst dir nicht selbst folgen");
        }
    }

    private User findUserByUsernameOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Nutzer '" + username + "' nicht gefunden"));
    }

    private User findUserByIdOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Nutzer nicht gefunden"));
    }
}
