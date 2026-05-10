package com.dualnet.service;

import com.dualnet.dto.CommentRequest;
import com.dualnet.dto.CommentResponse;
import com.dualnet.model.Comment;
import com.dualnet.model.User;
import com.dualnet.repository.CommentRepository;
import com.dualnet.repository.PostRepository;
import com.dualnet.repository.UserRepository;
import com.dualnet.service.mapper.CommentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentService commentService;

    private Comment testComment;
    private User testAuthor;
    private CommentResponse testResponse;

    @BeforeEach
    void setUp() {
        testAuthor = new User();
        testAuthor.setId("author-1");
        testAuthor.setUsername("testuser");

        testComment = new Comment();
        testComment.setId("comment-1");
        testComment.setPostId("post-1");
        testComment.setAuthorId("author-1");
        testComment.setContent("Ein Kommentar");

        testResponse = new CommentResponse("comment-1", "post-1", "Ein Kommentar",
                "author-1", "testuser", "2026-01-01T10:00:00");
    }

    @Test
    void addComment_speichertKommentarKorrekt() {
        CommentRequest request = new CommentRequest();
        request.setContent("Ein Kommentar");

        when(postRepository.existsById("post-1")).thenReturn(true);
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);
        when(userRepository.findById("author-1")).thenReturn(Optional.of(testAuthor));
        when(commentMapper.toResponse(testComment, testAuthor)).thenReturn(testResponse);

        CommentResponse result = commentService.addComment("post-1", request, "author-1");

        assertThat(result.getContent()).isEqualTo("Ein Kommentar");
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getComments_gibtKommentarlisteZurueck() {
        when(postRepository.existsById("post-1")).thenReturn(true);
        when(commentRepository.findByPostIdOrderByCreatedAtAsc("post-1")).thenReturn(List.of(testComment));
        when(userRepository.findById("author-1")).thenReturn(Optional.of(testAuthor));
        when(commentMapper.toResponse(testComment, testAuthor)).thenReturn(testResponse);

        List<CommentResponse> comments = commentService.getComments("post-1");

        assertThat(comments).hasSize(1);
        assertThat(comments.get(0).getContent()).isEqualTo("Ein Kommentar");
    }
}
