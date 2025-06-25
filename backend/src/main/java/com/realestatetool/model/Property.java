package com.realestatetool.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    private UUID id;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal price;
    private int bedrooms;
    private int bathrooms;
    private int squareFeet;
    private String propertyType;
    private LocalDate listingDate;
    private String status;
    private UUID ownerId;
    private double latitude;
    private double longitude;
    private String description;
    private String imageUrl;
    private String energyClass;
    private String region;
    private String neighborhood;
    private Boolean hasParking;
    private Boolean solarWaterHeater;
    private Integer yearBuilt;
    private List<Map<String, Object>> historicalPrices;
}
