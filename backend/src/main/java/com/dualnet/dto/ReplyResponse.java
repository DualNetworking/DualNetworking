package com.dualnet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReplyResponse {
    private String id;
    private String commentId;
    private String content;
    private String authorId;
    private String authorUsername;
    private String createdAt;
}
