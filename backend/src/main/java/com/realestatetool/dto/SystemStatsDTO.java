package com.realestatetool.dto;

import lombok.Data;

@Data
public class SystemStatsDTO {
    private Integer totalProperties;
    private Integer totalUsers;
    private Integer totalFavorites;
    private Double avgPrice;
    private Double maxPrice;
    private Double minPrice;

    // Getters and setters
}