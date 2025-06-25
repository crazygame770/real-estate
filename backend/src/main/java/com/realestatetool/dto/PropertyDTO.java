package com.realestatetool.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    @NotBlank(message = "Address is required")
    private String address;
    
    private String city;
    private String state;
    private String zipCode;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @Positive(message = "Number of bedrooms must be positive")
    private int bedrooms;
    
    @Positive(message = "Number of bathrooms must be positive")
    private int bathrooms;
    
    @Positive(message = "Square feet must be positive")
    private int squareFeet;
    
    @NotBlank(message = "Property type is required")
    private String propertyType;
    
    private String status;
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
}
