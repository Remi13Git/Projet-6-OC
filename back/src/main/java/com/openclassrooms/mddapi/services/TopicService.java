package com.openclassrooms.mddapi.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.repository.TopicRepository;

/**
 * Service qui gère les opérations relatives aux topics (thèmes) dans l'application.
 * Ce service permet de récupérer la liste de tous les topics disponibles dans le système.
 */
@Service
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    /**
     * Récupère la liste de tous les topics disponibles dans la base de données.
     * 
     * Cette méthode interroge le repository pour obtenir tous les topics et les retourne sous forme de liste.
     * 
     * @return Une liste de tous les topics présents dans la base de données.
     */
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }
}
