package com.realestatetool.controller;

import com.realestatetool.dto.PropertyDTO;
import com.realestatetool.model.Property;
import com.realestatetool.service.PropertyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public Mono<List<Property>> getAllProperties(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return propertyService.getAllProperties(token);
    }

    @GetMapping("/{id}")
    public Mono<Property> getPropertyById(@PathVariable UUID id, 
                                          @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return propertyService.getPropertyById(id, token);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Property> createProperty(@Valid @RequestBody PropertyDTO propertyDTO,
                                         @AuthenticationPrincipal Jwt jwt,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UUID userId = UUID.fromString(jwt.getSubject());
        return propertyService.createProperty(propertyDTO, userId, token);
    }

    @PutMapping("/{id}")
    public Mono<Property> updateProperty(@PathVariable UUID id,
                                         @Valid @RequestBody PropertyDTO propertyDTO,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return propertyService.updateProperty(id, propertyDTO, token);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteProperty(@PathVariable UUID id,
                                     @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return propertyService.deleteProperty(id, token);
    }
}
