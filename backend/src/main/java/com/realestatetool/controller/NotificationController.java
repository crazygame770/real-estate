package com.realestatetool.controller;

import com.realestatetool.model.Notification;
import com.realestatetool.service.NotificationService;
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
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    
    @GetMapping
    public Mono<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        String userId = jwt.getSubject();
        log.debug("Getting notifications for user: {}", userId);
        
        return notificationService.getUserNotifications(userId, token);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Notification> createNotification(
            @Valid @RequestBody Notification notification,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Creating notification for user: {}", notification.getUserId());
        
        return notificationService.createNotification(notification, token);
    }
    
    @PatchMapping("/{id}/read")
    public Mono<Notification> markAsRead(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Marking notification as read: {}", id);
        
        return notificationService.markAsRead(id, token);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteNotification(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Deleting notification: {}", id);
        
        return notificationService.deleteNotification(id, token);
    }
    
    @PostMapping("/broadcast")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Void> createNotificationForAllUsers(
            @Valid @RequestBody Notification notificationTemplate,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        log.debug("Broadcasting notification to all users");
        
        return notificationService.createNotificationForAllUsers(notificationTemplate, token);
    }
}
