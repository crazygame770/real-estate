package com.realestatetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private UUID id;
    private String userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String userType; // buyer, seller, agent, etc.
    private String avatarUrl;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
