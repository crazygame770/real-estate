package com.realestatetool.controller;

import com.realestatetool.dto.PropertyDTO;
import com.realestatetool.model.Property;
import com.realestatetool.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
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
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PropertyController.class)
public class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyService propertyService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private Property testProperty;
    private PropertyDTO testPropertyDTO;
    private final UUID propertyId = UUID.randomUUID();
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        testProperty = new Property();
        testProperty.setId(propertyId);
        testProperty.setAddress("123 Test St");
        testProperty.setCity("Test City");
        testProperty.setState("TS");
        testProperty.setZipCode("12345");
        testProperty.setPrice(new BigDecimal("250000.00"));
        testProperty.setBedrooms(3);
        testProperty.setBathrooms(2);
        testProperty.setSquareFeet(1800);
        testProperty.setPropertyType("single-family");
        testProperty.setListingDate(LocalDate.now());
        testProperty.setStatus("active");
        testProperty.setOwnerId(userId);
        testProperty.setLatitude(34.0522);
        testProperty.setLongitude(-118.2437);
        testProperty.setDescription("Test property description");

        testPropertyDTO = new PropertyDTO();
        testPropertyDTO.setAddress("123 Test St");
        testPropertyDTO.setCity("Test City");
        testPropertyDTO.setState("TS");
        testPropertyDTO.setZipCode("12345");
        testPropertyDTO.setPrice(new BigDecimal("250000.00"));
        testPropertyDTO.setBedrooms(3);
        testPropertyDTO.setBathrooms(2);
        testPropertyDTO.setSquareFeet(1800);
        testPropertyDTO.setPropertyType("single-family");
        testPropertyDTO.setStatus("active");
        testPropertyDTO.setLatitude(34.0522);
        testPropertyDTO.setLongitude(-118.2437);
        testPropertyDTO.setDescription("Test property description");
    }

    @Test
    @WithMockUser
    void getAllProperties_returnsProperties() throws Exception {
        when(propertyService.getAllProperties(anyString())).thenReturn(Mono.just(List.of(testProperty)));

        mockMvc.perform(get("/properties")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(propertyId.toString()))
                .andExpect(jsonPath("$[0].address").value("123 Test St"))
                .andExpect(jsonPath("$[0].city").value("Test City"));
    }

    @Test
    @WithMockUser
    void getPropertyById_returnsProperty() throws Exception {
        when(propertyService.getPropertyById(eq(propertyId), anyString())).thenReturn(Mono.just(testProperty));

        mockMvc.perform(get("/properties/" + propertyId)
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(propertyId.toString()))
                .andExpect(jsonPath("$.address").value("123 Test St"))
                .andExpect(jsonPath("$.city").value("Test City"));
    }

    @Test
    @WithMockUser
    void createProperty_returnsCreatedProperty() throws Exception {
        when(propertyService.createProperty(any(PropertyDTO.class), any(UUID.class), anyString()))
                .thenReturn(Mono.just(testProperty));

        mockMvc.perform(post("/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"address\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zipCode\":\"12345\",\"price\":250000.00,\"bedrooms\":3,\"bathrooms\":2,\"squareFeet\":1800,\"propertyType\":\"single-family\",\"status\":\"active\",\"latitude\":34.0522,\"longitude\":-118.2437,\"description\":\"Test property description\"}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(propertyId.toString()))
                .andExpect(jsonPath("$.address").value("123 Test St"))
                .andExpect(jsonPath("$.city").value("Test City"));
    }
}
