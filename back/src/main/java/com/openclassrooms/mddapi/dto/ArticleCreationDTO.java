package com.openclassrooms.mddapi.dto;

public class ArticleCreationDTO {
    private Integer topicId;

    private String title;
    private String content;

    // Getters et setters
    public Integer getTopicId() { return topicId; }
    public void setTopicId(Integer topicId) { this.topicId = topicId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}

