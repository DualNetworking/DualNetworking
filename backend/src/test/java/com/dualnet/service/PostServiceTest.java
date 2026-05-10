package com.dualnet.service;

import com.dualnet.dto.PostRequest;
import com.dualnet.dto.PostResponse;
import com.dualnet.model.Post;
import com.dualnet.model.User;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.PostMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PostMapper postMapper;

    @InjectMocks
    private PostService postService;

    private Post testPost;
    private User testAuthor;
    private PostResponse testResponse;

    @BeforeEach
    void setUp() {
        testAuthor = new User();
        testAuthor.setId("author-1");
        testAuthor.setUsername("testuser");

        testPost = new Post();
        testPost.setId("post-1");
        testPost.setAuthorId("author-1");
        testPost.setContent("Test-Inhalt");

        testResponse = new PostResponse("post-1", "Test-Inhalt", "", "author-1",
                "testuser", 0, new ArrayList<>(), "2026-01-01T10:00:00");
    }

    @Test
    void createPost_speichertPostKorrekt() {
        PostRequest request = new PostRequest();
        request.setContent("Test-Inhalt");

        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        when(userRepository.findById("author-1")).thenReturn(Optional.of(testAuthor));
        when(postMapper.toResponse(testPost, testAuthor)).thenReturn(testResponse);

        PostResponse result = postService.createPost(request, "author-1");

        assertThat(result.getContent()).isEqualTo("Test-Inhalt");
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void getFeed_gibtAllePostsZurueck() {
        when(postRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(testPost));
        when(userRepository.findById("author-1")).thenReturn(Optional.of(testAuthor));
        when(postMapper.toResponse(testPost, testAuthor)).thenReturn(testResponse);

        List<PostResponse> feed = postService.getFeed();

        assertThat(feed).hasSize(1);
    }

    @Test
    void likePost_fuegtLikeHinzu() {
        when(postRepository.findById("post-1")).thenReturn(Optional.of(testPost));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        when(userRepository.findById("author-1")).thenReturn(Optional.of(testAuthor));
        when(postMapper.toResponse(any(), any())).thenReturn(testResponse);

        postService.likePost("post-1", "user-2");

        ArgumentCaptor<Post> captor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository).save(captor.capture());
        assertThat(captor.getValue().getLikes()).contains("user-2");
    }
}
