package com.dualnet.repository;

import com.dualnet.model.Reply;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReplyRepository extends MongoRepository<Reply, String> {

    List<Reply> findByCommentIdOrderByCreatedAtAsc(String commentId);
}
