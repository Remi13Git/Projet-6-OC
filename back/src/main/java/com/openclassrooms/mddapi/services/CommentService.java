package com.openclassrooms.mddapi.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

/**
 * Service qui gère la logique métier des commentaires.
 * Ce service permet d'ajouter des commentaires à un article et de récupérer les commentaires associés à un article.
 */
@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Récupère tous les commentaires d'un article spécifié par son identifiant.
     * 
     * Cette méthode permet de récupérer tous les commentaires associés à un article donné.
     * Elle retourne une liste de commentaires ou une réponse avec un message d'erreur si aucun commentaire n'est trouvé.
     * 
     * @param articleId L'identifiant de l'article pour lequel les commentaires sont récupérés.
     * @return          La réponse HTTP contenant la liste des commentaires associés à l'article.
     */
    public ResponseEntity<?> getCommentsByArticle(Integer articleId) {
        List<Comment> comments = commentRepository.findByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Ajoute un commentaire à un article spécifié par son identifiant.
     * 
     * Cette méthode permet à un utilisateur authentifié d'ajouter un commentaire sur un article. Si l'utilisateur
     * ou l'article n'est pas trouvé, ou si l'utilisateur n'est pas authentifié, une erreur est retournée.
     * 
     * @param articleId   L'identifiant de l'article auquel le commentaire est associé.
     * @param commentDTO  L'objet DTO contenant les informations du commentaire (contenu, etc.).
     * @param userDetails Les détails de l'utilisateur authentifié.
     * @return            Une réponse HTTP avec un message de succès ou d'erreur.
     */
    public ResponseEntity<?> addComment(Integer articleId, CommentDTO commentDTO, UserDetails userDetails) {
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
