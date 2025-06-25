package com.realestatetool.service;

import com.realestatetool.client.SupabaseClient;
import com.realestatetool.constants.TableNames;
import com.realestatetool.model.Favorite;
import com.realestatetool.model.Property;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final SupabaseClient supabaseClient;
    private final PropertyService propertyService;
    private static final String TABLE_NAME = TableNames.FAVORITES;

    public Mono<List<Favorite>> getUserFavorites(UUID userId, String authToken) {
        log.info("Fetching favorites for user: {}", userId);
        Map<String, String> filters = new HashMap<>();
        filters.put("user_id", userId.toString());
        
        return supabaseClient.query(TABLE_NAME, filters, authToken, Favorite[].class)
                .map(Arrays::asList);
    }

    public Mono<List<Property>> getUserFavoriteProperties(UUID userId, String authToken) {
        log.info("Fetching favorite properties for user: {}", userId);
        
        return getUserFavorites(userId, authToken)
                .flatMap(favorites -> {
                    if (favorites.isEmpty()) {
                        return Mono.just(List.of());
                    }
                    
                    List<Mono<Property>> propertyMonos = favorites.stream()
                            .map(favorite -> propertyService.getPropertyById(favorite.getPropertyId(), authToken))
                            .toList();
                    
                    return Mono.zip(propertyMonos, objects -> Arrays.stream(objects)
                            .map(o -> (Property) o)
                            .toList());
                });
    }

    public Mono<Favorite> addFavorite(UUID userId, UUID propertyId, String authToken) {
        log.info("Adding property {} to favorites for user: {}", propertyId, userId);
        
        Favorite favorite = new Favorite();
        favorite.setId(UUID.randomUUID());
        favorite.setUserId(userId);
        favorite.setPropertyId(propertyId);
        favorite.setCreatedAt(LocalDateTime.now());
        
        return supabaseClient.create(TABLE_NAME, favorite, authToken, Favorite.class);
    }

    public Mono<Void> removeFavorite(UUID userId, UUID propertyId, String authToken) {
        log.info("Removing property {} from favorites for user: {}", propertyId, userId);
        
        Map<String, String> filters = new HashMap<>();
        filters.put("user_id", userId.toString());
        filters.put("property_id", propertyId.toString());
        
        return supabaseClient.query(TABLE_NAME, filters, authToken, Favorite[].class)
                .flatMap(favorites -> {
                    if (favorites.length == 0) {
                        return Mono.empty();
                    }
                    return supabaseClient.delete(TABLE_NAME, favorites[0].getId().toString(), authToken);
                });
    }
}
