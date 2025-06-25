package com.realestatetool.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class SupabaseClient {

    private final WebClient supabaseWebClient;
    private final ObjectMapper objectMapper;
    
    /**
     * Get all records from a table
     */
    public <T> Mono<T[]> getAll(String table, String authToken, Class<T[]> responseType) {
        log.debug("Fetching all records from table: {}", table);
        return supabaseWebClient.get()
                .uri("/rest/v1/{table}?select=*", table)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error fetching records from {}: {}", table, error.getMessage()));
    }
    
    /**
     * Get a record by id
     */
    public <T> Mono<T> getById(String table, String id, String authToken, Class<T> responseType) {
        log.debug("Fetching record from table: {} with id: {}", table, id);
        return supabaseWebClient.get()
                .uri("/rest/v1/{table}?id=eq.{id}&select=*", table, id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(jsonArray -> {
                    if (jsonArray.isEmpty()) {
                        return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
                    }
                    try {
                        T result = objectMapper.treeToValue(jsonArray.get(0), responseType);
                        return Mono.just(result);
                    } catch (Exception e) {
                        return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error parsing response"));
                    }
                })
                .doOnError(error -> log.error("Error fetching record from {} with id {}: {}", table, id, error.getMessage()));
    }
    
    /**
     * Create a new record
     */
    public <T, R> Mono<R> create(String table, T data, String authToken, Class<R> responseType) {
        log.debug("Creating new record in table: {}", table);
        return supabaseWebClient.post()
                .uri("/rest/v1/{table}", table)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .header("Prefer", "return=representation")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error creating record in {}: {}", table, error.getMessage()));
    }
    
    /**
     * Update a record
     */
    public <T, R> Mono<R> update(String table, String id, T data, String authToken, Class<R> responseType) {
        log.debug("Updating record in table: {} with id: {}", table, id);
        return supabaseWebClient.patch()
                .uri("/rest/v1/{table}?id=eq.{id}", table, id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .header("Prefer", "return=representation")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error updating record in {} with id {}: {}", table, id, error.getMessage()));
    }
    
    /**
     * Delete a record
     */
    public Mono<Void> delete(String table, String id, String authToken) {
        log.debug("Deleting record from table: {} with id: {}", table, id);
        return supabaseWebClient.delete()
                .uri("/rest/v1/{table}?id=eq.{id}", table, id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnError(error -> log.error("Error deleting record from {} with id {}: {}", table, id, error.getMessage()));
    }
    
    /**
     * Query records with specific filters
     */
    public <T> Mono<T[]> query(String table, Map<String, String> filters, String authToken, Class<T[]> responseType) {
        log.debug("Querying records from table: {} with filters: {}", table, filters);
        
        StringBuilder queryParams = new StringBuilder("?select=*");
        filters.forEach((key, value) -> queryParams.append("&").append(key).append("=eq.").append(value));
        
        return supabaseWebClient.get()
                .uri("/rest/v1/{table}" + queryParams.toString(), table)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error querying records from {}: {}", table, error.getMessage()));
    }
    
    /**
     * Get records with custom query string
     */
    public <T> Mono<T> getWithCustomQuery(String table, String queryString, String authToken, Class<T> responseType) {
        log.debug("Fetching records from table: {} with custom query: {}", table, queryString);
        return supabaseWebClient.get()
                .uri("/rest/v1/{table}" + queryString, table)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error fetching records from {} with custom query: {}", table, error.getMessage()));
    }
    
    /**
     * Execute custom SQL query (non-admin version, uses user auth token)
     */
    public <T> Mono<T> executeRawSql(String sql, String authToken, Class<T> responseType) {
        log.debug("Executing raw SQL: {}", sql);
        return supabaseWebClient.post()
                .uri("/rest/v1/rpc/execute_sql")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .bodyValue(Map.of("sql", sql))
                .retrieve()
                .bodyToMono(responseType)
                .doOnError(error -> log.error("Error executing raw SQL: {}", error.getMessage()));
    }
}
