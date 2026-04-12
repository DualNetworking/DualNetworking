package com.dualnet.repository;

import com.dualnet.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// Repository für Kommentar-Datenbankoperationen
public interface CommentRepository extends MongoRepository<Comment, String> {

    // Lädt alle Kommentare zu einem Post (älteste zuerst, damit die Reihenfolge passt)
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}
