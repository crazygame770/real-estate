package com.realestatetool.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.realestatetool.client.AdminSupabaseClient;
import com.realestatetool.client.SupabaseClient;
import com.realestatetool.dto.SystemStatsDTO;
import com.realestatetool.model.Notification;
import com.realestatetool.model.Property;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminSupabaseClient adminSupabaseClient;

    public Mono<JsonNode> getAllUsers() {
        log.info("Getting all users as admin");
        return adminSupabaseClient.getAllUsers(JsonNode.class);
    }
    
    public Mono<JsonNode> getUserById(String userId) {
        log.info("Getting user by id as admin: {}", userId);
        return adminSupabaseClient.getUserById(userId, JsonNode.class);
    }
    
    public Mono<JsonNode> executeQuery(String sql) {
        log.info("Executing custom query as admin");
        return adminSupabaseClient.executeRawSql(sql, JsonNode.class);
    }
    
    public Mono<List<Property>> getPropertiesByCustomQuery(String query) {
        log.info("Executing custom property query: {}", query);
        String sql = "SELECT * FROM properties WHERE " + query;
        return adminSupabaseClient.executeRawSql(sql, Property[].class)
                .map(Arrays::asList);

    }
    
    public Mono<Void> createStorageBucket(String bucketName) {
        log.info("Creating storage bucket: {}", bucketName);
        return adminSupabaseClient.createBucket(bucketName);
    }
    
    public Mono<SystemStatsDTO> getSystemStats() {
        log.info("Retrieving system statistics");
        String sql = """
                SELECT 
                  (SELECT COUNT(*) FROM properties) as total_properties,
                  (SELECT COUNT(*) FROM user_profiles) as total_users,
                  (SELECT COUNT(*) FROM favorites) as total_favorites,
                  (SELECT AVG(price) FROM properties) as avg_price,
                  (SELECT MAX(price) FROM properties) as max_price,
                  (SELECT MIN(price) FROM properties WHERE price > 0) as min_price
                """;
        
        return adminSupabaseClient.executeRawSql(sql, SystemStatsDTO.class);
    }
}
