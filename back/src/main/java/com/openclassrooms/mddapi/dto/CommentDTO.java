package com.openclassrooms.mddapi.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentDTO {

    @NotBlank(message = "Le contenu du commentaire est requis")
    private String content;

    // Getters & Setters
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}
