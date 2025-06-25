package com.realestatetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {
    private UUID id;
    private UUID userId;
    private UUID propertyId;
    private LocalDateTime createdAt;
    private String notes;
}
