package com.realestatetool.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Client for admin operations using the service role key
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSupabaseClient {

    private final WebClient adminSupabaseWebClient;
    
    /**
     * Execute raw SQL as admin
     */
    public <T> Mono<T> executeRawSql(String sql, Class<T> responseType) {
        log.debug("Executing raw SQL as admin: {}", sql);
        return adminSupabaseWebClient.post()
                .uri("/rest/v1/rpc/execute_sql")
                .bodyValue(new SqlRequest(sql))
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error executing raw SQL: {}", error.getMessage()));
    }
    
    /**
     * Get all users data (requires service role)
     */
    public <T> Mono<T> getAllUsers(Class<T> responseType) {
        log.debug("Fetching all users as admin");
        return adminSupabaseWebClient.get()
                .uri("/auth/v1/admin/users")
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error fetching all users: {}", error.getMessage()));
    }
    
    /**
     * Get user by id (requires service role)
     */
    public <T> Mono<T> getUserById(String userId, Class<T> responseType) {
        log.debug("Fetching user by id as admin: {}", userId);
        return adminSupabaseWebClient.get()
                .uri("/auth/v1/admin/users/{user_id}", userId)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error fetching user by id {}: {}", userId, error.getMessage()));
    }
    
    /**
     * Create a new bucket (for file storage)
     */
    public Mono<Void> createBucket(String bucketName) {
        log.debug("Creating bucket: {}", bucketName);
        return adminSupabaseWebClient.post()
                .uri("/storage/v1/bucket")
                .bodyValue(new BucketRequest(bucketName, "public"))
                .retrieve()
                .bodyToMono(Void.class)
                .doOnError(error -> log.error("Error creating bucket {}: {}", bucketName, error.getMessage()));
    }
    
    // Request classes
    private record SqlRequest(String sql) {}
    private record BucketRequest(String name, String public_access) {}
}
