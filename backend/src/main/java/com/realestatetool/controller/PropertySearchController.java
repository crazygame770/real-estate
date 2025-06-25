package com.realestatetool.controller;

import com.realestatetool.model.Property;
import com.realestatetool.service.PropertySearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/properties/search")
@RequiredArgsConstructor
public class PropertySearchController {

    private final PropertySearchService propertySearchService;

    @GetMapping
    public Mono<List<Property>> searchProperties(
            @RequestParam Map<String, String> searchParams,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        log.debug("REST request to search properties with params: {}", searchParams);
        return propertySearchService.searchProperties(searchParams, token);
    }

    @GetMapping("/nearby")
    public Mono<List<Property>> searchNearby(
            @RequestParam("lat") double latitude,
            @RequestParam("lng") double longitude,
            @RequestParam(value = "radius", defaultValue = "1.0") double radiusKm,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        log.debug("Searching properties nearby: lat={}, lng={}, radius={}km", latitude, longitude, radiusKm);
        return propertySearchService.searchNearby(latitude, longitude, radiusKm, token);
    }

    @GetMapping("/price-range")
    public Mono<List<Property>> searchByPriceRange(
            @RequestParam("min") double minPrice,
            @RequestParam("max") double maxPrice,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        log.debug("Searching properties in price range: {} - {}", minPrice, maxPrice);
        return propertySearchService.searchByPriceRange(minPrice, maxPrice, token);
    }

    @GetMapping("/neighborhood/{neighborhood}")
    public Mono<List<Property>> searchByNeighborhood(
            @PathVariable String neighborhood,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        log.debug("Searching properties in neighborhood: {}", neighborhood);
        return propertySearchService.searchByNeighborhood(neighborhood, token);
    }

    @PostMapping("/advanced")
    public Mono<List<Property>> advancedSearch(
            @RequestBody Map<String, Object> searchCriteria,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        log.debug("Performing advanced property search with criteria: {}", searchCriteria);
        return propertySearchService.advancedSearch(searchCriteria, token);
    }
}
