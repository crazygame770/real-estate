package com.realestatetool.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.realestatetool.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;
    
    @PostMapping(value = "/upload/{bucket}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Map<String, String>> uploadFile(
            @RequestPart("file") MultipartFile file,
            @PathVariable String bucket,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Uploading file to bucket: {}", bucket);
        
        return storageService.uploadFile(file, bucket, token)
                .map(fileName -> Map.of("fileName", fileName));
    }
    
    @GetMapping("/url/{bucket}/{fileName}")
    public Mono<Map<String, String>> getPublicUrl(
            @PathVariable String bucket,
            @PathVariable String fileName,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Getting public URL for file: {} in bucket: {}", fileName, bucket);
        
        return storageService.getPublicUrl(bucket, fileName, token)
                .map(url -> Map.of("publicUrl", url));
    }
    
    @GetMapping("/list/{bucket}")
    public Mono<JsonNode> listFiles(
            @PathVariable String bucket,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Listing files in bucket: {}", bucket);
        
        return storageService.listFiles(bucket, token);
    }
    
    @DeleteMapping("/{bucket}/{fileName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteFile(
            @PathVariable String bucket,
            @PathVariable String fileName,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Deleting file: {} from bucket: {}", fileName, bucket);
        
        return storageService.deleteFile(bucket, fileName, token);
    }
}
