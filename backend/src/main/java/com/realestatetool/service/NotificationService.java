package com.realestatetool.service;

import com.realestatetool.client.AdminSupabaseClient;
import com.realestatetool.client.SupabaseClient;
import com.realestatetool.model.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SupabaseClient supabaseClient;
    private final AdminSupabaseClient adminSupabaseClient;
    private static final String TABLE_NAME = "notifications";

    /**
     * Get all notifications for a user
     */
    public Mono<List<Notification>> getUserNotifications(String userId, String authToken) {
        log.info("Fetching notifications for user: {}", userId);
        
        return supabaseClient.getWithCustomQuery(
                TABLE_NAME, 
                String.format("?user_id=eq.%s&select=*&order=created_at.desc", userId),
                authToken,
                Notification[].class)
            .map(Arrays::asList);
    }
    
    /**
     * Create a notification for a specific user
     */
    public Mono<Notification> createNotification(Notification notification, String authToken) {
        log.info("Creating notification for user: {}", notification.getUserId());
        
        notification.setId(UUID.randomUUID());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        
        return supabaseClient.create(TABLE_NAME, notification, authToken, Notification.class);
    }
    
    /**
     * Mark a notification as read
     */
    public Mono<Notification> markAsRead(UUID notificationId, String authToken) {
        log.info("Marking notification as read: {}", notificationId);
        
        return supabaseClient.getById(TABLE_NAME, notificationId.toString(), authToken, Notification.class)
            .flatMap(notification -> {
                notification.setRead(true);
                return supabaseClient.update(TABLE_NAME, notificationId.toString(), notification, 
                                           authToken, Notification.class);
            });
    }
    
    /**
     * Create notifications for all users (admin function)
     */
    public Mono<Void> createNotificationForAllUsers(Notification notificationTemplate, String authToken) {
        log.info("Creating notification for all users");
        
        // Get all users and create a notification for each
        String sql = "SELECT id FROM profiles";
        
        return adminSupabaseClient.executeRawSql(sql, UUID[].class)
            .flatMapMany(userIds -> {
                // For each user, create a notification
                return Mono.just(Arrays.asList(userIds))
                    .flatMapIterable(users -> users)
                    .flatMap(userId -> {
                        Notification notification = new Notification();
                        notification.setId(UUID.randomUUID());
                        notification.setUserId(userId.toString());
                        notification.setTitle(notificationTemplate.getTitle());
                        notification.setMessage(notificationTemplate.getMessage());
                        notification.setType(notificationTemplate.getType());
                        notification.setPropertyTitle(notificationTemplate.getPropertyTitle());
                        notification.setCreatedAt(LocalDateTime.now());
                        notification.setRead(false);
                        
                        return supabaseClient.create(TABLE_NAME, notification, authToken, Notification.class);
                    });
            })
            .then();
    }
    
    /**
     * Delete a notification
     */
    public Mono<Void> deleteNotification(UUID notificationId, String authToken) {
        log.info("Deleting notification: {}", notificationId);
        return supabaseClient.delete(TABLE_NAME, notificationId.toString(), authToken);
    }
}
