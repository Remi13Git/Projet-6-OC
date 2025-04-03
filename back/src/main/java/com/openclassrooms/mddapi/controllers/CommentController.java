package com.openclassrooms.mddapi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.services.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/article/{articleId}")
    public ResponseEntity<?> getCommentsByArticle(@PathVariable Integer articleId) {
        return commentService.getCommentsByArticle(articleId);
    }

    @PostMapping("/article/{articleId}")
    public ResponseEntity<?> addComment(@PathVariable Integer articleId,
                                        @RequestBody CommentDTO commentDTO,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        return commentService.addComment(articleId, commentDTO, userDetails);
    }
}
