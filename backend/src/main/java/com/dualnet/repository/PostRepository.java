package com.dualnet.repository;

import com.dualnet.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// Repository für Post-Datenbankoperationen
public interface PostRepository extends MongoRepository<Post, String> {

    // Lädt alle Posts sortiert nach Erstellungszeit (neueste zuerst) → für den Feed
    List<Post> findAllByOrderByCreatedAtDesc();

    // Lädt alle Posts eines bestimmten Nutzers (neueste zuerst) → für Profilseite
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);
}
