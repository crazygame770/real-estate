package com.realestatetool.controller;

import com.realestatetool.model.Favorite;
import com.realestatetool.model.Property;
import com.realestatetool.service.FavoriteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FavoriteController.class)
public class FavoriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FavoriteService favoriteService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private Favorite favorite;
    private Property property;
    private final UUID favoriteId = UUID.randomUUID();
    private final UUID userId = UUID.randomUUID();
    private final UUID propertyId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        favorite = new Favorite();
        favorite.setId(favoriteId);
        favorite.setUserId(userId);
        favorite.setPropertyId(propertyId);
        favorite.setCreatedAt(LocalDateTime.now());
        favorite.setNotes("Test favorite");

        property = new Property();
        property.setId(propertyId);
        property.setAddress("123 Test St");
        property.setCity("Test City");
        property.setState("TS");
        property.setZipCode("12345");
        property.setPrice(new BigDecimal("250000.00"));
        property.setBedrooms(3);
        property.setBathrooms(2);
        property.setSquareFeet(1800);
        property.setPropertyType("single-family");
        property.setListingDate(LocalDate.now());
        property.setStatus("active");
        property.setOwnerId(userId);
    }

    @Test
    void getUserFavorites_returnsFavorites() throws Exception {
        when(favoriteService.getUserFavorites(eq(userId), anyString()))
                .thenReturn(Mono.just(List.of(favorite)));

        mockMvc.perform(get("/favorites")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(favoriteId.toString()))
                .andExpect(jsonPath("$[0].userId").value(userId.toString()))
                .andExpect(jsonPath("$[0].propertyId").value(propertyId.toString()));
    }

    @Test
    void getUserFavoriteProperties_returnsFavoriteProperties() throws Exception {
        when(favoriteService.getUserFavoriteProperties(eq(userId), anyString()))
                .thenReturn(Mono.just(List.of(property)));

        mockMvc.perform(get("/favorites/properties")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(propertyId.toString()))
                .andExpect(jsonPath("$[0].address").value("123 Test St"))
                .andExpect(jsonPath("$[0].city").value("Test City"));
    }

    @Test
    void addFavorite_returnsCreatedFavorite() throws Exception {
        when(favoriteService.addFavorite(eq(userId), eq(propertyId), anyString()))
                .thenReturn(Mono.just(favorite));

        mockMvc.perform(post("/favorites/" + propertyId)
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(favoriteId.toString()))
                .andExpect(jsonPath("$.userId").value(userId.toString()))
                .andExpect(jsonPath("$.propertyId").value(propertyId.toString()));
    }

    @Test
    void removeFavorite_returnsNoContent() throws Exception {
        when(favoriteService.removeFavorite(eq(userId), eq(propertyId), anyString()))
                .thenReturn(Mono.empty());

        mockMvc.perform(delete("/favorites/" + propertyId)
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNoContent());
    }
}
