package com.openclassrooms.mddapi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.UserProfileDTO;
import com.openclassrooms.mddapi.services.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getProfile(userDetails);
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubscribedTopics(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getSubscribedTopics(userDetails);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @Valid @RequestBody UserProfileDTO profileDTO) {
        return profileService.updateProfile(userDetails, profileDTO);
    }

    @DeleteMapping("/subscriptions/{topicId}")
    public ResponseEntity<?> unsubscribeFromTopic(@AuthenticationPrincipal UserDetails userDetails,
                                                  @PathVariable Integer topicId) {
        return profileService.unsubscribeFromTopic(userDetails, topicId);
    }
}
