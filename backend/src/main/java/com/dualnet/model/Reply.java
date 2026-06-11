package com.dualnet.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "replies")
public class Reply {

    @Id
    private String id;

    private String commentId;
    private String authorId;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
}
