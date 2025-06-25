package com.realestatetool.controller;

import com.realestatetool.model.Property;
import com.realestatetool.service.PropertySearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PropertySearchController.class)
public class PropertySearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertySearchService propertySearchService;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    @WithMockUser
    void searchByNeighborhood_returnsPropertiesInNeighborhood() throws Exception {
        Property property = createTestProperty();
        
        when(propertySearchService.searchByNeighborhood(eq("Kolonaki"), anyString()))
                .thenReturn(Mono.just(List.of(property)));

        mockMvc.perform(get("/properties/search/neighborhood/Kolonaki")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].address").value("123 Test St"));
    }

    @Test
    @WithMockUser
    void searchByPriceRange_returnsPropertiesInRange() throws Exception {
        Property property = createTestProperty();
        
        when(propertySearchService.searchByPriceRange(eq(100000.0), eq(300000.0), anyString()))
                .thenReturn(Mono.just(List.of(property)));

        mockMvc.perform(get("/properties/search/price-range")
                .param("min", "100000.0")
                .param("max", "300000.0")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].price").value(250000.0));
    }

    @Test
    @WithMockUser
    void searchNearby_returnsPropertiesNearLocation() throws Exception {
        Property property = createTestProperty();
        
        when(propertySearchService.searchNearby(eq(37.9838), eq(23.7275), eq(1.0), anyString()))
                .thenReturn(Mono.just(List.of(property)));

        mockMvc.perform(get("/properties/search/nearby")
                .param("lat", "37.9838")
                .param("lng", "23.7275")
                .param("radius", "1.0")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    @WithMockUser
    void advancedSearch_returnsFilteredProperties() throws Exception {
        Property property = createTestProperty();
        
        when(propertySearchService.advancedSearch(any(Map.class), anyString()))
                .thenReturn(Mono.just(List.of(property)));

        mockMvc.perform(post("/properties/search/advanced")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"minBedrooms\":2,\"maxBedrooms\":3,\"propertyTypes\":[\"apartment\"],\"energyClasses\":[\"A\",\"B\"],\"hasParking\":true}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists());
    }

    private Property createTestProperty() {
        Property property = new Property();
        property.setId(UUID.randomUUID());
        property.setAddress("123 Test St");
        property.setCity("Athens");
        property.setState("Attica");
        property.setZipCode("12345");
        property.setPrice(new BigDecimal("250000.00"));
        property.setBedrooms(2);
        property.setBathrooms(1);
        property.setSquareFeet(80);
        property.setPropertyType("apartment");
        property.setListingDate(LocalDate.now());
        property.setStatus("available");
        property.setLatitude(37.9838);
        property.setLongitude(23.7275);
        property.setRegion("central-athens");
        property.setNeighborhood("Kolonaki");
        property.setEnergyClass("B");
        property.setHasParking(true);
        property.setSolarWaterHeater(false);
        property.setYearBuilt(1995);
        return property;
    }
}
