package com.openclassrooms.mddapi.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

/**
 * Service qui gère les abonnements des utilisateurs aux différents topics (thèmes).
 * Ce service permet aux utilisateurs de s'abonner à des topics, de vérifier s'ils sont déjà abonnés,
 * et de récupérer leurs abonnements.
 */
@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Permet à un utilisateur de s'abonner à un topic.
     * 
     * Cette méthode vérifie si l'utilisateur est authentifié, si l'ID du topic est fourni et valide,
     * et si l'utilisateur n'est pas déjà abonné au topic. Si toutes les conditions sont remplies,
     * l'abonnement est enregistré dans la base de données.
     * 
     * @param userDetails     Les détails de l'utilisateur authentifié.
     * @param requestBody     Le corps de la requête contenant l'ID du topic auquel l'utilisateur veut s'abonner.
     * @return               Une réponse HTTP contenant un message de succès ou d'erreur.
     */
    public ResponseEntity<?> subscribe(UserDetails userDetails, Map<String, Integer> requestBody) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        Integer topicId = requestBody.get("topicId");
        if (topicId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "topicId est requis"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        Topic topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Topic non trouvé"));
        }

        boolean exists = subscriptionRepository.existsByUserAndTopic(user, topic);
        if (exists) {
            return ResponseEntity.badRequest().body(Map.of("error", "Déjà abonné"));
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);
        subscriptionRepository.save(subscription);
        return ResponseEntity.ok(Map.of("message", "Abonnement réussi"));
    }

    /**
     * Récupère tous les topics auxquels un utilisateur est abonné.
     * 
     * Cette méthode permet de récupérer la liste des IDs des topics auxquels l'utilisateur authentifié est abonné.
     * Si l'utilisateur n'est pas trouvé, une erreur est renvoyée.
     * 
     * @param userDetails     Les détails de l'utilisateur authentifié.
     * @return               Une réponse HTTP contenant la liste des IDs des topics auxquels l'utilisateur est abonné.
     */
    public ResponseEntity<?> getSubscriptions(UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        List<Integer> topicIds = subscriptionRepository.findByUser(user)
                .stream()
                .map(subscription -> subscription.getTopic().getId())
                .collect(Collectors.toList());

        return ResponseEntity.ok(topicIds);
    }
}
