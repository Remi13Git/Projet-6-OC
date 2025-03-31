package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    
    @NotBlank(message = "L'identifiant est requis")
    private String identifier; // email ou username
    
    @NotBlank(message = "Le mot de passe est requis")
    private String password;

    // Getters et Setters
    public String getIdentifier() {
        return identifier;
    }
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
