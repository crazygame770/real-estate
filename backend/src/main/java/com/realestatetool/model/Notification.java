package com.realestatetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private UUID id;
    private String userId;
    private String title;
    private String message;
    private String type;
    private String propertyTitle;
    private LocalDateTime createdAt;
    private boolean isRead;
}
