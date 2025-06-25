package com.realestatetool.security;

import com.realestatetool.model.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Utility class for JWT token operations.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    /**
     * Extract user ID from JWT token
     */
    public String getUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getSubject();
        }
        return null;
    }
    
    /**
     * Extract the UUID user ID from JWT token
     */
    public Optional<UUID> getUserIdAsUUID(Authentication authentication) {
        String userId = getUserId(authentication);
        if (userId != null) {
            try {
                return Optional.of(UUID.fromString(userId));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid UUID format for user ID: {}", userId);
            }
        }
        return Optional.empty();
    }
    
    /**
     * Check if a user has a specific role
     */
    public boolean hasRole(Authentication authentication, String role) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            
            // Check in app_metadata.roles array if it exists
            try {
                Map<String, Object> appMetadata = jwt.getClaim("app_metadata");
                if (appMetadata != null && appMetadata.containsKey("roles")) {
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) appMetadata.get("roles");
                    return roles.contains(role);
                }
            } catch (Exception e) {
                log.debug("Could not extract roles from JWT token", e);
            }
        }
        return false;
    }
    
    /**
     * Check if the authenticated user is the owner of the profile
     */
    public boolean isProfileOwner(Authentication authentication, UserProfile profile) {
        String userId = getUserId(authentication);
        return userId != null && userId.equals(profile.getUserId());
    }
    
    /**
     * Extract claims from JWT token
     */
    public Map<String, Object> extractClaims(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return new HashMap<>(jwt.getClaims());
        }
        return new HashMap<>();
    }
}
