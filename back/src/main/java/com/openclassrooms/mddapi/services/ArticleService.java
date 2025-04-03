package com.openclassrooms.mddapi.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.ArticleCreationDTO;
import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

/**
 * Service qui gère la logique métier pour la gestion des articles.
 * Ce service permet de créer des articles, de récupérer des articles existants,
 * et de lister tous les articles.
 */
@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crée un nouvel article.
     * 
     * Cette méthode permet de créer un article en associant un utilisateur et un
     * topic spécifié. Si l'utilisateur est non authentifié ou si un problème est
     * rencontré avec les données (comme un utilisateur ou un topic non trouvé), une
     * erreur est retournée.
     * 
     * @param articleDTO   L'objet DTO contenant les informations nécessaires à la création de l'article.
     * @param userDetails  Les détails de l'utilisateur authentifié (utilisé pour retrouver l'utilisateur).
     * @return             Une réponse HTTP avec un message de succès ou d'erreur.
     */
    public ResponseEntity<?> createArticle(ArticleCreationDTO articleDTO, UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        Topic topic = topicRepository.findById(articleDTO.getTopicId()).orElse(null);
        if (topic == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thème (Topic) non trouvé"));
        }

        Article article = new Article();
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());
        article.setTopic(topic);
        article.setAuthor(user);

        articleRepository.save(article);
        return ResponseEntity.ok(Map.of("message", "Article créé avec succès"));
    }

    /**
     * Récupère tous les articles.
     * 
     * Cette méthode permet de récupérer tous les articles présents dans la base de
     * données.
     * 
     * @return Une liste de tous les articles.
     */
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    /**
     * Récupère un article par son identifiant.
     * 
     * Cette méthode permet de récupérer un article spécifique à partir de son
     * identifiant unique. Si l'article n'existe pas, une erreur 404 est retournée.
     * 
     * @param id L'identifiant de l'article à récupérer.
     * @return   La réponse HTTP contenant les détails de l'article, ou une erreur si l'article n'est pas trouvé.
     */
    public ResponseEntity<?> getArticleById(Integer id) {
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
