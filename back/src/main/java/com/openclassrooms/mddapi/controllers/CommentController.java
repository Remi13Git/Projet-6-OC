package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Endpoint pour récupérer les commentaires d'un article
    @GetMapping("/article/{articleId}")
    public ResponseEntity<?> getCommentsByArticle(@PathVariable Integer articleId) {
        List<Comment> comments = commentRepository.findByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    // Endpoint pour ajouter un commentaire à un article
    @PostMapping("/article/{articleId}")
    public ResponseEntity<?> addComment(@PathVariable Integer articleId,
                                        @Valid @RequestBody CommentDTO commentDTO,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non authentifié"));
        }

        Article article = articleRepository.findById(articleId).orElse(null);
        if (article == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Article non trouvé"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setArticle(article);
        comment.setUser(user);

        commentRepository.save(comment);
        return ResponseEntity.ok(Map.of("message", "Commentaire ajouté avec succès"));
    }
}
