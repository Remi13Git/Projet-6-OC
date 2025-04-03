package com.openclassrooms.mddapi.controllers;

import java.util.Map;

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

import com.openclassrooms.mddapi.services.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:4200")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> subscribe(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody Map<String, Integer> requestBody) {
        return subscriptionService.subscribe(userDetails, requestBody);
    }

    @GetMapping
    public ResponseEntity<?> getSubscriptions(@AuthenticationPrincipal UserDetails userDetails) {
        return subscriptionService.getSubscriptions(userDetails);
    }
}
