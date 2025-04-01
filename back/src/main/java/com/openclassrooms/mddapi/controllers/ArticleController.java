package com.openclassrooms.mddapi.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.ArticleCreationDTO;
import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:4200")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createArticle(
            @Valid @RequestBody ArticleCreationDTO articleDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Récupérer l'utilisateur connecté
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non authentifié"));
        }
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }
        
        // Récupérer le topic par l'ID fourni
        Topic topic = topicRepository.findById(articleDTO.getTopicId()).orElse(null);
        if (topic == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thème (Topic) non trouvé"));
        }
        
        // Créer l'article
        Article article = new Article();
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());
        article.setTopic(topic);
        article.setAuthor(user);
        
        articleRepository.save(article);
        return ResponseEntity.ok(Map.of("message", "Article créé avec succès"));
    }

    @GetMapping
    public ResponseEntity<?> getAllArticles() {
        List<Article> articles = articleRepository.findAll();
        // Vous pouvez mapper vos entités vers un DTO si nécessaire
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Integer id) {
        Optional<Article> articleOptional = articleRepository.findById(id);

        if (articleOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Article non trouvé"));
        }

        Article article = articleOptional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("id", article.getId());
        response.put("title", article.getTitle());
        response.put("content", article.getContent());
        response.put("createdAt", article.getCreatedAt());
        response.put("author", Map.of(
            "id", article.getAuthor().getId(),
            "username", article.getAuthor().getUsername()
        ));
        response.put("topic", Map.of(
            "id", article.getTopic().getId(),
            "name", article.getTopic().getName()
        ));

        return ResponseEntity.ok(response);
    }

}
