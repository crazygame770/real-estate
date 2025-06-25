package com.realestatetool.controller;

import com.realestatetool.dto.UserProfileDTO;
import com.realestatetool.model.UserProfile;
import com.realestatetool.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/user-profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public Mono<UserProfile> getCurrentUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String userId = jwt.getSubject();
        log.debug("Getting current user profile for user: {}", userId);
        
        return userProfileService.getCurrentUserProfile(userId, token);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserProfile> createUserProfile(
            @Valid @RequestBody UserProfileDTO profileDTO,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String userId = jwt.getSubject();
        log.debug("Creating user profile for user: {}", userId);
        
        return userProfileService.createUserProfile(profileDTO, userId, token);
    }

    @PutMapping
    public Mono<UserProfile> updateUserProfile(
            @Valid @RequestBody UserProfileDTO profileDTO,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String userId = jwt.getSubject();
        log.debug("Updating user profile for user: {}", userId);
        
        return userProfileService.updateUserProfile(profileDTO, userId, token);
    }
}
