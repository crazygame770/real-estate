package com.realestatetool.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.realestatetool.client.SupabaseClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {

    private final SupabaseClient supabaseClient;
    private final WebClient supabaseWebClient;

    /**
     * Upload a file to Supabase Storage
     */
    public Mono<String> uploadFile(MultipartFile file, String bucket, String authToken) {
        log.info("Uploading file to bucket: {}", bucket);
        String fileName = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
        
        return DataBufferUtils.join(DataBufferUtils.read(
                file.getResource(), 
                DefaultDataBufferFactory.sharedInstance, 
                8192))
            .flatMap(dataBuffer -> {
                MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
                bodyBuilder.part("file", dataBuffer)
                    .filename(fileName)
                    .contentType(MediaType.parseMediaType(file.getContentType()));
                
                return supabaseWebClient.post()
                    .uri("/storage/v1/object/{bucket}/{path}", bucket, fileName)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .map(response -> fileName);
            })
            .doOnError(error -> log.error("Error uploading file to bucket {}: {}", bucket, error.getMessage()));
    }
    
    /**
     * Get the public URL for a file
     */
    public Mono<String> getPublicUrl(String bucket, String fileName, String authToken) {
        log.info("Getting public URL for file: {} in bucket: {}", fileName, bucket);
        
        return supabaseWebClient.get()
            .uri("/storage/v1/object/public/{bucket}/{path}", bucket, fileName)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
            .retrieve()
            .bodyToMono(JsonNode.class)
            .map(response -> response.path("publicUrl").asText())
            .doOnError(error -> log.error("Error getting public URL for file {} in bucket {}: {}", 
                fileName, bucket, error.getMessage()));
    }

    /**
     * List all files in a bucket
     */
    public Mono<JsonNode> listFiles(String bucket, String authToken) {
        log.info("Listing files in bucket: {}", bucket);
        
        return supabaseWebClient.get()
            .uri("/storage/v1/object/list/{bucket}", bucket)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
            .retrieve()
            .bodyToMono(JsonNode.class)
            .doOnError(error -> log.error("Error listing files in bucket {}: {}", bucket, error.getMessage()));
    }
    
    /**
     * Delete a file from Supabase Storage
     */
    public Mono<Void> deleteFile(String bucket, String fileName, String authToken) {
        log.info("Deleting file: {} from bucket: {}", fileName, bucket);
        
        return supabaseWebClient.delete()
            .uri("/storage/v1/object/{bucket}/{path}", bucket, fileName)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
            .retrieve()
            .bodyToMono(Void.class)
            .doOnError(error -> log.error("Error deleting file {} from bucket {}: {}", 
                fileName, bucket, error.getMessage()));
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    static class DefaultDataBufferFactory {
        static final org.springframework.core.io.buffer.DefaultDataBufferFactory sharedInstance = 
            new org.springframework.core.io.buffer.DefaultDataBufferFactory();
    }
}
