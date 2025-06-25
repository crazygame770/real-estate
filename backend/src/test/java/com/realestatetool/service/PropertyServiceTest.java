package com.realestatetool.service;

import com.realestatetool.client.SupabaseClient;
import com.realestatetool.dto.PropertyDTO;
import com.realestatetool.model.Property;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PropertyServiceTest {

    @Mock
    private SupabaseClient supabaseClient;

    @InjectMocks
    private PropertyService propertyService;

    private Property testProperty;
    private PropertyDTO testPropertyDTO;
    private final UUID propertyId = UUID.randomUUID();
    private final UUID userId = UUID.randomUUID();
    private final String authToken = "test-token";

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
    void getAllProperties_shouldReturnListOfProperties() {
        // Given
        Property[] properties = new Property[] { testProperty };
        when(supabaseClient.getAll(anyString(), eq(authToken), eq(Property[].class)))
                .thenReturn(Mono.just(properties));

        // When
        Mono<List<Property>> result = propertyService.getAllProperties(authToken);

        // Then
        StepVerifier.create(result)
                .expectNext(Arrays.asList(properties))
                .verifyComplete();
    }

    @Test
    void getPropertyById_shouldReturnProperty() {
        // Given
        when(supabaseClient.getById(anyString(), eq(propertyId.toString()), eq(authToken), eq(Property.class)))
                .thenReturn(Mono.just(testProperty));

        // When
        Mono<Property> result = propertyService.getPropertyById(propertyId, authToken);

        // Then
        StepVerifier.create(result)
                .expectNext(testProperty)
                .verifyComplete();
    }

    @Test
    void createProperty_shouldReturnCreatedProperty() {
        // Given
        when(supabaseClient.create(anyString(), any(Property.class), eq(authToken), eq(Property.class)))
                .thenReturn(Mono.just(testProperty));

        // When
        Mono<Property> result = propertyService.createProperty(testPropertyDTO, userId, authToken);

        // Then
        StepVerifier.create(result)
                .expectNextMatches(property -> 
                    property.getAddress().equals(testProperty.getAddress()) &&
                    property.getPrice().equals(testProperty.getPrice()) &&
                    property.getOwnerId().equals(testProperty.getOwnerId())
                )
                .verifyComplete();
    }

    @Test
    void updateProperty_shouldReturnUpdatedProperty() {
        // Given
        when(supabaseClient.getById(anyString(), eq(propertyId.toString()), eq(authToken), eq(Property.class)))
                .thenReturn(Mono.just(testProperty));
        when(supabaseClient.update(anyString(), eq(propertyId.toString()), any(Property.class), eq(authToken), eq(Property.class)))
                .thenReturn(Mono.just(testProperty));

        // Update some property details
        testPropertyDTO.setPrice(new BigDecimal("275000.00"));
        testPropertyDTO.setDescription("Updated description");

        // When
        Mono<Property> result = propertyService.updateProperty(propertyId, testPropertyDTO, authToken);

        // Then
        StepVerifier.create(result)
                .expectNext(testProperty)
                .verifyComplete();
    }

    @Test
    void deleteProperty_shouldCompleteSuccessfully() {
        // Given
        when(supabaseClient.delete(anyString(), eq(propertyId.toString()), eq(authToken)))
                .thenReturn(Mono.empty());

        // When
        Mono<Void> result = propertyService.deleteProperty(propertyId, authToken);

        // Then
        StepVerifier.create(result)
                .verifyComplete();
    }
}
