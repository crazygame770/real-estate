package com.realestatetool.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.realestatetool.dto.SystemStatsDTO;
import com.realestatetool.model.Property;
import com.realestatetool.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')") // Assuming admin role is set in JWT
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public Mono<JsonNode> getAllUsers() {
        log.debug("Fetching all users as admin");
        return adminService.getAllUsers();
    }
    
    @GetMapping("/users/{userId}")
    public Mono<JsonNode> getUserById(@PathVariable String userId) {
        log.debug("Fetching user by id as admin: {}", userId);
        return adminService.getUserById(userId);
    }
    
    @PostMapping("/query")
    public Mono<JsonNode> executeQuery(@RequestBody String sql) {
        log.debug("Executing custom query as admin: {}", sql);
        return adminService.executeQuery(sql);
    }
    
    @GetMapping("/properties/custom")
    public Mono<List<Property>> getPropertiesByCustomQuery(@RequestParam String query) {
        log.debug("Executing custom property query: {}", query);
        return adminService.getPropertiesByCustomQuery(query);
    }
    
    @PostMapping("/storage/buckets")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Void> createStorageBucket(@RequestBody Map<String, String> request) {
        String bucketName = request.get("name");
        log.debug("Creating storage bucket: {}", bucketName);
        return adminService.createStorageBucket(bucketName);
    }
    
    @GetMapping("/stats")
    public Mono<SystemStatsDTO> getSystemStats() {
        log.debug("Getting system statistics");
        return adminService.getSystemStats();
    }
}
