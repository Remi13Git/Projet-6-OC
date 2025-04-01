package com.openclassrooms.mddapi.dto;

public class UserProfileDTO {
    private String email;
    private String username;
    private String password; // Ce champ sera renseigné si l'utilisateur souhaite changer son mot de passe

    // Getters et setters
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
