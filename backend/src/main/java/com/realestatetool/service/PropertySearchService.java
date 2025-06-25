package com.realestatetool.service;

import com.realestatetool.client.SupabaseClient;
import com.realestatetool.constants.TableNames;
import com.realestatetool.model.Property;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertySearchService {

    private final SupabaseClient supabaseClient;
    private static final String TABLE_NAME = TableNames.PROPERTIES;

    public Mono<List<Property>> searchProperties(Map<String, String> searchParams, String authToken) {
        log.info("Searching properties with params: {}", searchParams);
        
        StringBuilder queryBuilder = new StringBuilder("?select=*");
        
        if (searchParams.containsKey("city")) {
            queryBuilder.append("&city=ilike.%").append(searchParams.get("city")).append("%");
        }
        
        if (searchParams.containsKey("state")) {
            queryBuilder.append("&state=eq.").append(searchParams.get("state"));
        }
        
        if (searchParams.containsKey("minPrice")) {
            queryBuilder.append("&price=gte.").append(searchParams.get("minPrice"));
        }
        
        if (searchParams.containsKey("maxPrice")) {
            queryBuilder.append("&price=lte.").append(searchParams.get("maxPrice"));
        }
        
        if (searchParams.containsKey("minBeds")) {
            queryBuilder.append("&bedrooms=gte.").append(searchParams.get("minBeds"));
        }
        
        if (searchParams.containsKey("minBaths")) {
            queryBuilder.append("&bathrooms=gte.").append(searchParams.get("minBaths"));
        }
        
        if (searchParams.containsKey("propertyType")) {
            queryBuilder.append("&property_type=eq.").append(searchParams.get("propertyType"));
        }
        
        if (searchParams.containsKey("status")) {
            queryBuilder.append("&status=eq.").append(searchParams.get("status"));
        }
        
        // Add ordering
        queryBuilder.append("&order=price.asc");
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, queryBuilder.toString(), authToken, Property[].class)
                .map(Arrays::asList);
    }
    
    public Mono<List<Property>> getPropertiesNearLocation(Double latitude, Double longitude, Double radiusInMiles, String authToken) {
        log.info("Finding properties near location: lat={}, lng={}, radius={}mi", latitude, longitude, radiusInMiles);
        
        // Convert miles to degrees (approximate, assumes 1 degree = 69 miles)
        double radiusInDegrees = radiusInMiles / 69.0;
        
        String query = String.format(
            "?select=*&latitude=gte.%f&latitude=lte.%f&longitude=gte.%f&longitude=lte.%f",
            latitude - radiusInDegrees,
            latitude + radiusInDegrees,
            longitude - radiusInDegrees,
            longitude + radiusInDegrees
        );
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, query, authToken, Property[].class)
                .map(Arrays::asList);
    }
    
    public Mono<List<Property>> getPropertiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, String authToken) {
        log.info("Finding properties in price range: {} to {}", minPrice, maxPrice);
        
        String query = String.format("?select=*&price=gte.%s&price=lte.%s&order=price.asc", 
                minPrice.toString(), maxPrice.toString());
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, query, authToken, Property[].class)
                .map(Arrays::asList);
    }

    /**
     * Search properties by neighborhood
     */
    public Mono<List<Property>> searchByNeighborhood(String neighborhood, String authToken) {
        log.info("Searching properties in neighborhood: {}", neighborhood);
        
        String query = String.format("?neighborhood=eq.%s&select=*", neighborhood);
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, query, authToken, Property[].class)
                .map(Arrays::asList);
    }
    
    /**
     * Search properties with advanced filters
     */
    public Mono<List<Property>> advancedSearch(Map<String, Object> advancedFilters, String authToken) {
        log.info("Performing advanced search with filters: {}", advancedFilters);
        
        StringBuilder queryBuilder = new StringBuilder("?select=*");
        
        // Add filters for different property attributes
        if (advancedFilters.containsKey("minBedrooms")) {
            queryBuilder.append("&bedrooms=gte.").append(advancedFilters.get("minBedrooms"));
        }
        
        if (advancedFilters.containsKey("maxBedrooms")) {
            queryBuilder.append("&bedrooms=lte.").append(advancedFilters.get("maxBedrooms"));
        }
        
        if (advancedFilters.containsKey("minBathrooms")) {
            queryBuilder.append("&bathrooms=gte.").append(advancedFilters.get("minBathrooms"));
        }
        
        if (advancedFilters.containsKey("propertyTypes")) {
            @SuppressWarnings("unchecked")
            List<String> propertyTypes = (List<String>) advancedFilters.get("propertyTypes");
            if (!propertyTypes.isEmpty()) {
                queryBuilder.append("&property_type=in.(")
                        .append(String.join(",", propertyTypes))
                        .append(")");
            }
        }
        
        if (advancedFilters.containsKey("energyClasses")) {
            @SuppressWarnings("unchecked")
            List<String> energyClasses = (List<String>) advancedFilters.get("energyClasses");
            if (!energyClasses.isEmpty()) {
                queryBuilder.append("&energy_class=in.(")
                        .append(String.join(",", energyClasses))
                        .append(")");
            }
        }
        
        if (advancedFilters.containsKey("minYearBuilt")) {
            queryBuilder.append("&year_built=gte.").append(advancedFilters.get("minYearBuilt"));
        }
        
        if (advancedFilters.containsKey("minSquareFeet")) {
            queryBuilder.append("&square_feet=gte.").append(advancedFilters.get("minSquareFeet"));
        }
        
        if (advancedFilters.containsKey("maxSquareFeet")) {
            queryBuilder.append("&square_feet=lte.").append(advancedFilters.get("maxSquareFeet"));
        }
        
        if (advancedFilters.containsKey("hasParking")) {
            queryBuilder.append("&parking=eq.").append(advancedFilters.get("hasParking"));
        }
        
        if (advancedFilters.containsKey("hasSolarWaterHeater")) {
            queryBuilder.append("&solar_water_heater=eq.").append(advancedFilters.get("hasSolarWaterHeater"));
        }
        
        // Add ordering
        queryBuilder.append("&order=price.asc");
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, queryBuilder.toString(), authToken, Property[].class)
                .map(Arrays::asList);
    }

    /**
     * Search properties by price range
     */
    public Mono<List<Property>> searchByPriceRange(double minPrice, double maxPrice, String authToken) {
        log.info("Searching properties in price range: {} - {}", minPrice, maxPrice);
        
        String query = String.format("?price=gte.%.2f&price=lte.%.2f&select=*", minPrice, maxPrice);
        
        return supabaseClient.getWithCustomQuery(TABLE_NAME, query, authToken, Property[].class)
                .map(Arrays::asList);
    }
    
    /**
     * Search properties in vicinity of a location
     */
    public Mono<List<Property>> searchNearby(double latitude, double longitude, double radiusKm, String authToken) {
        log.info("Searching properties nearby: lat={}, lng={}, radius={}km", latitude, longitude, radiusKm);
        
        // Using PostgreSQL's earthdistance extension function for geospatial search
        // earth_distance computes the great circle distance between two points on the earth's surface
        String sql = String.format("""
                SELECT *
                FROM properties
                WHERE earth_distance(
                    ll_to_earth(%f, %f),
                    ll_to_earth(latitude, longitude)
                ) < %f * 1000
                """, latitude, longitude, radiusKm);
        
        // Execute raw SQL query through Supabase
        return supabaseClient.executeRawSql(sql, authToken, Property[].class)
                .map(Arrays::asList);
    }
}
