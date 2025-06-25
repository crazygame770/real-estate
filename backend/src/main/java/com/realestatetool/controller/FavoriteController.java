package com.realestatetool.controller;

import com.realestatetool.model.Favorite;
import com.realestatetool.model.Property;
import com.realestatetool.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public Mono<List<Favorite>> getUserFavorites(@AuthenticationPrincipal Jwt jwt,
                                               @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UUID userId = UUID.fromString(jwt.getSubject());
        
        return favoriteService.getUserFavorites(userId, token);
    }

    @GetMapping("/properties")
    public Mono<List<Property>> getUserFavoriteProperties(@AuthenticationPrincipal Jwt jwt,
                                                        @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UUID userId = UUID.fromString(jwt.getSubject());
        
        return favoriteService.getUserFavoriteProperties(userId, token);
    }

    @PostMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Favorite> addFavorite(@PathVariable UUID propertyId,
                                     @AuthenticationPrincipal Jwt jwt,
                                     @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UUID userId = UUID.fromString(jwt.getSubject());
        
        return favoriteService.addFavorite(userId, propertyId, token);
    }

    @DeleteMapping("/{propertyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> removeFavorite(@PathVariable UUID propertyId,
                                    @AuthenticationPrincipal Jwt jwt,
                                    @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UUID userId = UUID.fromString(jwt.getSubject());
        
        return favoriteService.removeFavorite(userId, propertyId, token);
    }
}
