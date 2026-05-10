package com.dualnet.service;

import com.dualnet.dto.UserProfileResponse;
import com.dualnet.model.User;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PostService postService;

    @InjectMocks
    private UserService userService;

    private User targetUser;
    private User currentUser;

    @BeforeEach
    void setUp() {
        targetUser = new User();
        targetUser.setId("target-id");
        targetUser.setUsername("zielnutzer");

        currentUser = new User();
        currentUser.setId("current-id");
        currentUser.setUsername("ichnutzer");
    }

    @Test
    void getProfile_gibtUserProfileResponseZurueck() {
        UserProfileResponse expected = new UserProfileResponse("target-id", "zielnutzer", "", 0, 0);
        when(userRepository.findByUsername("zielnutzer")).thenReturn(Optional.of(targetUser));
        when(userMapper.toProfileResponse(targetUser)).thenReturn(expected);

        UserProfileResponse result = userService.getProfile("zielnutzer");

        assertThat(result.getUsername()).isEqualTo("zielnutzer");
    }

    @Test
    void followUser_aktualisiertFollowerListe() {
        when(userRepository.findByUsername("zielnutzer")).thenReturn(Optional.of(targetUser));
        when(userRepository.findById("current-id")).thenReturn(Optional.of(currentUser));

        userService.followUser("zielnutzer", "current-id");

        assertThat(targetUser.getFollowers()).contains("current-id");
        assertThat(currentUser.getFollowing()).contains("target-id");
        verify(userRepository, times(2)).save(org.mockito.ArgumentMatchers.any(User.class));
    }

    @Test
    void unfollowUser_entferntAusFollowerListe() {
        targetUser.getFollowers().add("current-id");
        currentUser.getFollowing().add("target-id");

        when(userRepository.findByUsername("zielnutzer")).thenReturn(Optional.of(targetUser));
        when(userRepository.findById("current-id")).thenReturn(Optional.of(currentUser));

        userService.unfollowUser("zielnutzer", "current-id");

        assertThat(targetUser.getFollowers()).doesNotContain("current-id");
        assertThat(currentUser.getFollowing()).doesNotContain("target-id");
    }
}
