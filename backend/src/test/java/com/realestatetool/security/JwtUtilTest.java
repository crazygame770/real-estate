package com.realestatetool.security;

import com.realestatetool.model.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtUtilTest {

    @InjectMocks
    private JwtUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    private final String userId = UUID.randomUUID().toString();
    private final Map<String, Object> claims = new HashMap<>();
    private final Map<String, Object> appMetadata = new HashMap<>();

    @BeforeEach
    void setUp() {
        appMetadata.put("roles", Arrays.asList("admin", "user"));
        claims.put("sub", userId);
        claims.put("app_metadata", appMetadata);
        claims.put("email", "test@example.com");
        
        when(jwt.getSubject()).thenReturn(userId);
        when(jwt.getClaims()).thenReturn(claims);
        when(authentication.getPrincipal()).thenReturn(jwt);
    }

    @Test
    void getUserId_shouldReturnUserId() {
        // When
        String result = jwtUtil.getUserId(authentication);

        // Then
        assertEquals(userId, result);
    }
    
    @Test
    void getUserId_shouldReturnNull_whenAuthenticationIsNull() {
        // When
        String result = jwtUtil.getUserId(null);

        // Then
        assertNull(result);
    }
    
    @Test
    void getUserId_shouldReturnNull_whenPrincipalIsNotJwt() {
        // Given
        when(authentication.getPrincipal()).thenReturn("not a jwt");

        // When
        String result = jwtUtil.getUserId(authentication);

        // Then
        assertNull(result);
    }

    @Test
    void getUserIdAsUUID_shouldReturnUUID() {
        // When
        Optional<UUID> result = jwtUtil.getUserIdAsUUID(authentication);

        // Then
        assertTrue(result.isPresent());
        assertEquals(UUID.fromString(userId), result.get());
    }
    
    @Test
    void getUserIdAsUUID_shouldReturnEmpty_whenUserIdIsNotValidUUID() {
        // Given
        when(jwt.getSubject()).thenReturn("not-a-uuid");

        // When
        Optional<UUID> result = jwtUtil.getUserIdAsUUID(authentication);

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void hasRole_shouldReturnTrue_whenUserHasRole() {
        // When
        boolean result = jwtUtil.hasRole(authentication, "admin");

        // Then
        assertTrue(result);
    }
    
    @Test
    void hasRole_shouldReturnFalse_whenUserDoesNotHaveRole() {
        // When
        boolean result = jwtUtil.hasRole(authentication, "manager");

        // Then
        assertFalse(result);
    }
    
    @Test
    void isProfileOwner_shouldReturnTrue_whenUserIsOwner() {
        // Given
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);

        // When
        boolean result = jwtUtil.isProfileOwner(authentication, profile);

        // Then
        assertTrue(result);
    }
    
    @Test
    void isProfileOwner_shouldReturnFalse_whenUserIsNotOwner() {
        // Given
        UserProfile profile = new UserProfile();
        profile.setUserId(UUID.randomUUID().toString());

        // When
        boolean result = jwtUtil.isProfileOwner(authentication, profile);

        // Then
        assertFalse(result);
    }
    
    @Test
    void extractClaims_shouldReturnAllClaims() {
        // When
        Map<String, Object> result = jwtUtil.extractClaims(authentication);

        // Then
        assertFalse(result.isEmpty());
        assertEquals(userId, result.get("sub"));
        assertEquals("test@example.com", result.get("email"));
    }
}
