package com.openclassrooms.mddapi.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.JwtUtil;

/**
 * Service qui gère la logique métier de l'authentification des utilisateurs.
 * Ce service permet de connecter un utilisateur avec son identifiant (email ou nom d'utilisateur) et son mot de passe.
 * Il génère également un token JWT pour maintenir la session de l'utilisateur.
 */
@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Connecte un utilisateur en fonction de son identifiant (email ou nom d'utilisateur) et de son mot de passe.
     * 
     * Cette méthode vérifie si les informations d'identification fournies sont valides, et génère un token JWT
     * si l'utilisateur est authentifié avec succès. Si les informations sont incorrectes, elle renvoie une erreur.
     * 
     * @param loginRequest L'objet contenant les informations d'identification de l'utilisateur (identifiant et mot de passe).
     * @return             Une réponse HTTP contenant le token JWT si la connexion est réussie, ou un message d'erreur si l'authentification échoue.
     */
    public ResponseEntity<?> loginUser(LoginRequest loginRequest) {
        String identifier = loginRequest.getIdentifier();
        String password = loginRequest.getPassword();

        // Recherche de l'utilisateur par email ou nom d'utilisateur
        User user = identifier.contains("@") 
            ? userRepository.findByEmail(identifier) 
            : userRepository.findByUsername(identifier);

        // Vérification de l'existence de l'utilisateur et de la validité du mot de passe
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Identifiants invalides"));
        }

        // Génération du JWT pour l'utilisateur authentifié
        String token = jwtUtil.generateToken(user.getUsername());

        // Construction de la réponse avec le token généré
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}
