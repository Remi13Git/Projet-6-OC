package com.openclassrooms.mddapi.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.UserProfileDTO;
import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.JwtUtil;

/**
 * Service qui gère la logique métier des profils utilisateurs.
 * Ce service permet de récupérer et de mettre à jour les informations de profil des utilisateurs,
 * ainsi que de gérer les abonnements et les désabonnements aux thèmes.
 */
@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Récupère le profil d'un utilisateur authentifié.
     * 
     * Cette méthode renvoie les informations de base du profil, telles que l'email et le nom d'utilisateur.
     * Si l'utilisateur n'est pas authentifié ou s'il n'est pas trouvé, une erreur est renvoyée.
     * 
     * @param userDetails Les informations de l'utilisateur authentifié.
     * @return            Une réponse HTTP contenant les informations du profil ou un message d'erreur si l'utilisateur n'est pas authentifié ou trouvé.
     */
    public ResponseEntity<?> getProfile(UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "username", user.getUsername()
        ));
    }

    /**
     * Récupère la liste des thèmes auxquels l'utilisateur est abonné.
     * 
     * Cette méthode renvoie les informations des thèmes auxquels l'utilisateur est abonné. 
     * Si l'utilisateur n'est pas authentifié ou si aucun abonnement n'est trouvé, un message d'erreur est renvoyé.
     * 
     * @param userDetails Les informations de l'utilisateur authentifié.
     * @return            Une réponse HTTP contenant la liste des thèmes abonnés ou un message d'erreur si l'utilisateur n'est pas authentifié ou n'a aucun abonnement.
     */
    public ResponseEntity<?> getSubscribedTopics(UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
        List<Map<String, Object>> topics = subscriptions.stream()
            .map(subscription -> {
                Map<String, Object> topicMap = new HashMap<>();
                topicMap.put("id", subscription.getTopic().getId());
                topicMap.put("name", subscription.getTopic().getName());
                topicMap.put("description", subscription.getTopic().getDescription());
                return topicMap;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(topics);
    }

    /**
     * Met à jour le profil d'un utilisateur.
     * 
     * Cette méthode permet de mettre à jour les informations du profil de l'utilisateur : email, nom d'utilisateur et mot de passe.
     * Si l'utilisateur n'est pas authentifié ou s'il n'est pas trouvé, un message d'erreur est renvoyé.
     * En cas de succès, un nouveau token JWT est généré pour l'utilisateur.
     * 
     * @param userDetails Les informations de l'utilisateur authentifié.
     * @param profileDTO  Les nouvelles informations de profil (email, username, password).
     * @return            Une réponse HTTP contenant un message de confirmation et un token JWT si la mise à jour a réussi, ou un message d'erreur en cas d'échec.
     */
    public ResponseEntity<?> updateProfile(UserDetails userDetails, UserProfileDTO profileDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        // Mise à jour des informations du profil
        if (profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()) {
            user.setEmail(profileDTO.getEmail());
        }
        if (profileDTO.getUsername() != null && !profileDTO.getUsername().isEmpty()) {
            user.setUsername(profileDTO.getUsername());
        }
        if (profileDTO.getPassword() != null && !profileDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(profileDTO.getPassword()));
        }

        userRepository.save(user);

        // Génération d'un nouveau token JWT
        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(Map.of(
            "message", "Profil mis à jour avec succès",
            "token", token
        ));
    }

    /**
     * Permet à un utilisateur de se désabonner d'un thème.
     * 
     * Cette méthode supprime un abonnement d'un utilisateur à un thème donné. Si l'utilisateur n'est pas authentifié,
     * ou si l'abonnement n'est pas trouvé, un message d'erreur est renvoyé.
     * 
     * @param userDetails Les informations de l'utilisateur authentifié.
     * @param topicId     L'ID du thème duquel l'utilisateur souhaite se désabonner.
     * @return            Une réponse HTTP contenant un message de confirmation ou un message d'erreur.
     */
    public ResponseEntity<?> unsubscribeFromTopic(UserDetails userDetails, Integer topicId) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        Optional<Topic> topicOpt = topicRepository.findById(topicId);
        if (topicOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thème non trouvé"));
        }

        Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserAndTopic(user, topicOpt.get());
        if (subscriptionOpt.isPresent()) {
            subscriptionRepository.delete(subscriptionOpt.get());
            return ResponseEntity.ok(Map.of("message", "Désabonnement réussi"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Abonnement non trouvé"));
        }
    }
}
