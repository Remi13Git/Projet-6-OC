package com.openclassrooms.mddapi.controllers;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        String identifier = loginRequest.getIdentifier();
        String password = loginRequest.getPassword();

        // Recherche de l'utilisateur par email ou username
        User user = null;
        if(identifier.contains("@")) {
            user = userRepository.findByEmail(identifier);
        } else {
            user = userRepository.findByUsername(identifier);
        }
        if (user == null) {
            return ResponseEntity.badRequest().body("Utilisateur non trouvé");
        }

        // Vérification du mot de passe
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mot de passe incorrect");
        }

        // Si tout est OK, renvoyer une réponse de succès 
        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("message", "Connexion réussie");
        }});
    }
}
