package com.openclassrooms.mddapi.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.UserRegistrationDTO;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repository.UserRepository;

/**
 * Service qui gère l'inscription des utilisateurs.
 * Ce service permet de créer un nouvel utilisateur dans le système après avoir vérifié que l'email
 * et le nom d'utilisateur ne sont pas déjà utilisés.
 */
@Service
public class RegistrationService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Enregistre un nouvel utilisateur dans le système.
     * 
     * Cette méthode vérifie d'abord si l'email et le nom d'utilisateur sont déjà pris dans la base de données.
     * Si l'un de ces champs est déjà utilisé, une erreur est renvoyée. Sinon, l'utilisateur est créé avec les
     * informations fournies et son mot de passe est crypté avant d'être enregistré.
     * 
     * @param registrationDTO Les informations nécessaires à l'inscription de l'utilisateur (email, nom d'utilisateur, mot de passe).
     * @return               Une réponse HTTP contenant un message de succès ou un message d'erreur en cas de conflits (email ou nom d'utilisateur déjà utilisés).
     */
    public ResponseEntity<?> registerUser(UserRegistrationDTO registrationDTO) {
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur déjà utilisé");
        }

        // Création de l'utilisateur
        User user = new User();
        user.setEmail(registrationDTO.getEmail());
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        userRepository.save(user);

        // Réponse de succès
        return ResponseEntity.ok(Map.of("message", "Utilisateur enregistré avec succès"));
    }
}
