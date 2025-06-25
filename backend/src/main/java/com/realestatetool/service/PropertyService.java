package com.realestatetool.service;

import com.realestatetool.client.SupabaseClient;
import com.realestatetool.constants.TableNames;
import com.realestatetool.dto.PropertyDTO;
import com.realestatetool.model.Property;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyService {

    private final SupabaseClient supabaseClient;
    private static final String TABLE_NAME = TableNames.PROPERTIES;

    public Mono<List<Property>> getAllProperties(String authToken) {
        log.info("Fetching all properties");
        return supabaseClient.getAll(TABLE_NAME, authToken, Property[].class)
                .map(Arrays::asList);
    }

    public Mono<Property> getPropertyById(UUID id, String authToken) {
        log.info("Fetching property with id: {}", id);
        return supabaseClient.getById(TABLE_NAME, id.toString(), authToken, Property.class);
    }

    public Mono<Property> createProperty(PropertyDTO propertyDTO, UUID currentUserId, String authToken) {
        log.info("Creating new property for user: {}", currentUserId);
        
        Property property = new Property();
        property.setId(UUID.randomUUID());
        property.setAddress(propertyDTO.getAddress());
        property.setCity(propertyDTO.getCity());
        property.setState(propertyDTO.getState());
        property.setZipCode(propertyDTO.getZipCode());
        property.setPrice(propertyDTO.getPrice());
        property.setBedrooms(propertyDTO.getBedrooms());
        property.setBathrooms(propertyDTO.getBathrooms());
        property.setSquareFeet(propertyDTO.getSquareFeet());
        property.setPropertyType(propertyDTO.getPropertyType());
        property.setListingDate(LocalDate.now());
        property.setStatus(propertyDTO.getStatus());
        property.setOwnerId(currentUserId);
        property.setLatitude(propertyDTO.getLatitude());
        property.setLongitude(propertyDTO.getLongitude());
        property.setDescription(propertyDTO.getDescription());
        property.setImageUrl(propertyDTO.getImageUrl());
        property.setEnergyClass(propertyDTO.getEnergyClass());
        property.setRegion(propertyDTO.getRegion());
        property.setNeighborhood(propertyDTO.getNeighborhood());
        property.setHasParking(propertyDTO.getHasParking());
        property.setSolarWaterHeater(propertyDTO.getSolarWaterHeater());
        property.setYearBuilt(propertyDTO.getYearBuilt());
        
        return supabaseClient.create(TABLE_NAME, property, authToken, Property.class);
    }

    public Mono<Property> updateProperty(UUID id, PropertyDTO propertyDTO, String authToken) {
        log.info("Updating property with id: {}", id);
        
        return supabaseClient.getById(TABLE_NAME, id.toString(), authToken, Property.class)
                .flatMap(existingProperty -> {
                    existingProperty.setAddress(propertyDTO.getAddress());
                    existingProperty.setCity(propertyDTO.getCity());
                    existingProperty.setState(propertyDTO.getState());
                    existingProperty.setZipCode(propertyDTO.getZipCode());
                    existingProperty.setPrice(propertyDTO.getPrice());
                    existingProperty.setBedrooms(propertyDTO.getBedrooms());
                    existingProperty.setBathrooms(propertyDTO.getBathrooms());
                    existingProperty.setSquareFeet(propertyDTO.getSquareFeet());
                    existingProperty.setPropertyType(propertyDTO.getPropertyType());
                    existingProperty.setStatus(propertyDTO.getStatus());
                    existingProperty.setLatitude(propertyDTO.getLatitude());
                    existingProperty.setLongitude(propertyDTO.getLongitude());
                    existingProperty.setDescription(propertyDTO.getDescription());
                    existingProperty.setImageUrl(propertyDTO.getImageUrl());
                    existingProperty.setEnergyClass(propertyDTO.getEnergyClass());
                    existingProperty.setRegion(propertyDTO.getRegion());
                    existingProperty.setNeighborhood(propertyDTO.getNeighborhood());
                    existingProperty.setHasParking(propertyDTO.getHasParking());
                    existingProperty.setSolarWaterHeater(propertyDTO.getSolarWaterHeater());
                    existingProperty.setYearBuilt(propertyDTO.getYearBuilt());
                    
                    return supabaseClient.update(TABLE_NAME, id.toString(), existingProperty, authToken, Property.class);
                });
    }

    public Mono<Void> deleteProperty(UUID id, String authToken) {
        log.info("Deleting property with id: {}", id);
        return supabaseClient.delete(TABLE_NAME, id.toString(), authToken);
    }
}
