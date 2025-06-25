package com.realestatetool.service;

import com.realestatetool.client.SupabaseClient;
import com.realestatetool.constants.TableNames;
import com.realestatetool.dto.UserProfileDTO;
import com.realestatetool.model.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final SupabaseClient supabaseClient;
    private static final String TABLE_NAME = TableNames.USER_PROFILES;

    public Mono<UserProfile> getCurrentUserProfile(String userId, String authToken) {
        log.info("Getting current user profile for user: {}", userId);
        return getUserProfileByUserId(userId, authToken);
    }

    public Mono<UserProfile> getUserProfileByUserId(String userId, String authToken) {
        log.info("Fetching user profile by userId: {}", userId);
        
        Map<String, String> filters = new HashMap<>();
        filters.put("user_id", userId);
        
        return supabaseClient.query(TABLE_NAME, filters, authToken, UserProfile[].class)
                .flatMap(profiles -> {
                    if (profiles.length == 0) {
                        return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));
                    }
                    return Mono.just(profiles[0]);
                });
    }

    public Mono<UserProfile> createUserProfile(UserProfileDTO profileDTO, String userId, String authToken) {
        log.info("Creating user profile for user: {}", userId);
        
        UserProfile userProfile = new UserProfile();
        userProfile.setId(UUID.randomUUID());
        userProfile.setUserId(userId);
        userProfile.setFullName(profileDTO.getFullName());
        userProfile.setEmail(profileDTO.getEmail());
        userProfile.setPhoneNumber(profileDTO.getPhoneNumber());
        userProfile.setUserType(profileDTO.getUserType());
        userProfile.setAvatarUrl(profileDTO.getAvatarUrl());
        userProfile.setBio(profileDTO.getBio());
        userProfile.setCreatedAt(LocalDateTime.now());
        
        return supabaseClient.create(TABLE_NAME, userProfile, authToken, UserProfile.class);
    }

    public Mono<UserProfile> updateUserProfile(UserProfileDTO profileDTO, String userId, String authToken) {
        log.info("Updating user profile for user: {}", userId);
        
        return getUserProfileByUserId(userId, authToken)
                .flatMap(existingProfile -> {
                    existingProfile.setFullName(profileDTO.getFullName());
                    existingProfile.setEmail(profileDTO.getEmail());
                    existingProfile.setPhoneNumber(profileDTO.getPhoneNumber());
                    existingProfile.setUserType(profileDTO.getUserType());
                    existingProfile.setAvatarUrl(profileDTO.getAvatarUrl());
                    existingProfile.setBio(profileDTO.getBio());
                    existingProfile.setUpdatedAt(LocalDateTime.now());
                    
                    return supabaseClient.update(TABLE_NAME, existingProfile.getId().toString(), 
                            existingProfile, authToken, UserProfile.class);
                });
    }
}
