package com.realestatetool.controller;

import com.realestatetool.dto.UserProfileDTO;
import com.realestatetool.model.UserProfile;
import com.realestatetool.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserProfileController.class)
public class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private UserProfile userProfile;
    private UserProfileDTO userProfileDTO;
    private final UUID profileId = UUID.randomUUID();
    private final String userId = UUID.randomUUID().toString();

    @BeforeEach
    void setUp() {
        userProfile = new UserProfile();
        userProfile.setId(profileId);
        userProfile.setUserId(userId);
        userProfile.setFullName("John Doe");
        userProfile.setEmail("john.doe@example.com");
        userProfile.setPhoneNumber("123-456-7890");
        userProfile.setUserType("buyer");
        userProfile.setAvatarUrl("https://example.com/avatar.jpg");
        userProfile.setBio("Test bio");

        userProfileDTO = new UserProfileDTO();
        userProfileDTO.setFullName("John Doe");
        userProfileDTO.setEmail("john.doe@example.com");
        userProfileDTO.setPhoneNumber("123-456-7890");
        userProfileDTO.setUserType("buyer");
        userProfileDTO.setAvatarUrl("https://example.com/avatar.jpg");
        userProfileDTO.setBio("Test bio");
    }

    @Test
    void getCurrentUserProfile_returnsProfile() throws Exception {
        when(userProfileService.getCurrentUserProfile(eq(userId), anyString()))
                .thenReturn(Mono.just(userProfile));

        mockMvc.perform(get("/user-profile/me")
                .with(jwt().jwt(jwt -> jwt.subject(userId)))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(profileId.toString()))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void createUserProfile_returnsCreatedProfile() throws Exception {
        when(userProfileService.createUserProfile(any(UserProfileDTO.class), eq(userId), anyString()))
                .thenReturn(Mono.just(userProfile));

        mockMvc.perform(post("/user-profile")
                .with(jwt().jwt(jwt -> jwt.subject(userId)))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"John Doe\",\"email\":\"john.doe@example.com\",\"phoneNumber\":\"123-456-7890\",\"userType\":\"buyer\",\"avatarUrl\":\"https://example.com/avatar.jpg\",\"bio\":\"Test bio\"}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(profileId.toString()))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.fullName").value("John Doe"));
    }

    @Test
    void updateUserProfile_returnsUpdatedProfile() throws Exception {
        when(userProfileService.updateUserProfile(any(UserProfileDTO.class), eq(userId), anyString()))
                .thenReturn(Mono.just(userProfile));

        mockMvc.perform(put("/user-profile")
                .with(jwt().jwt(jwt->jwt.subject(userId)))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"John Doe\",\"email\":\"john.doe@example.com\",\"phoneNumber\":\"123-456-7890\",\"userType\":\"buyer\",\"avatarUrl\":\"https://example.com/avatar.jpg\",\"bio\":\"Test bio\"}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(profileId.toString()))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.fullName").value("John Doe"));
    }
}
