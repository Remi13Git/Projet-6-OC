package com.openclassrooms.mddapi.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:4200")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Endpoint pour s'abonner à un topic
    @PostMapping
    public ResponseEntity<?> subscribe(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody Map<String, Integer> requestBody) {
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
    
    // Endpoint pour récupérer la liste des topic IDs auxquels l'utilisateur est abonné
    @GetMapping
    public ResponseEntity<?> getSubscriptions(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Utilisateur non trouvé"));
        }
        List<Subscription> subscriptions = subscriptionRepository.findAll()
            .stream().filter(s -> s.getUser().getId().equals(user.getId())).collect(Collectors.toList());
        List<Integer> topicIds = subscriptions.stream().map(s -> s.getTopic().getId()).collect(Collectors.toList());
        return ResponseEntity.ok(topicIds);
    }
}
