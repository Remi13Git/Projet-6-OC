package com.openclassrooms.mddapi.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.UserProfileDTO;
import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.JwtUtil;


@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Récupérer le profil de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }
        // Ne pas renvoyer le mot de passe
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "username", user.getUsername()
        ));
    }
    
    // Nouvel endpoint pour récupérer les thèmes abonnés par l'utilisateur
    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubscribedTopics(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }
        List<Subscription> subscriptions = subscriptionRepository.findByUser(user);
        // Mapper chaque abonnement pour renvoyer les infos du topic
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

    // Mettre à jour le profil de l'utilisateur connecté
    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UserProfileDTO profileDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        // Mettre à jour l'email et le username si fournis
        if (profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()) {
            user.setEmail(profileDTO.getEmail());
        }
        if (profileDTO.getUsername() != null && !profileDTO.getUsername().isEmpty()) {
            user.setUsername(profileDTO.getUsername());
        }

        // Mettre à jour le mot de passe s'il est fourni
        if (profileDTO.getPassword() != null && !profileDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(profileDTO.getPassword()));
        }

        // Sauvegarder les modifications dans la base de données
        userRepository.save(user);

        // Générer un nouveau token après la mise à jour du profil
        String token = jwtUtil.generateToken(user.getUsername());

        // Retourner la réponse avec le message de succès et le nouveau token
        return ResponseEntity.ok(Map.of(
            "message", "Profil mis à jour avec succès",
            "token", token  // Renvoi du nouveau token
        ));
    }

    @DeleteMapping("/subscriptions/{topicId}")
    public ResponseEntity<?> unsubscribeFromTopic(@AuthenticationPrincipal UserDetails userDetails,
                                                @PathVariable Integer topicId) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }

        // Vérifier si le topic existe
        Optional<Topic> topicOpt = topicRepository.findById(topicId);
        if (topicOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thème non trouvé"));
        }
        Topic topic = topicOpt.get(); // Récupération de l'objet Topic existant

        // Trouver l'abonnement correspondant
        Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserAndTopic(user, topic);
        if (subscriptionOpt.isPresent()) {
            subscriptionRepository.delete(subscriptionOpt.get());
            return ResponseEntity.ok(Map.of("message", "Désabonnement réussi"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Abonnement non trouvé"));
        }
    }

    
}
