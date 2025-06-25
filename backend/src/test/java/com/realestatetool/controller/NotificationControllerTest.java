package com.realestatetool.controller;

import com.realestatetool.model.Notification;
import com.realestatetool.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private Notification notification;
    private final UUID notificationId = UUID.randomUUID();
    private final String userId = UUID.randomUUID().toString();

    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setId(notificationId);
        notification.setUserId(userId);
        notification.setTitle("Test Notification");
        notification.setMessage("This is a test notification");
        notification.setType("property_added");
        notification.setPropertyTitle("Test Property");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
    }

    @Test
    @WithMockUser
    void getUserNotifications_returnsNotifications() throws Exception {
        when(notificationService.getUserNotifications(eq(userId), anyString()))
                .thenReturn(Mono.just(List.of(notification)));

        mockMvc.perform(get("/notifications")
                .with(jwt().jwt(jwt->jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(notificationId.toString()))
                .andExpect(jsonPath("$[0].userId").value(userId))
                .andExpect(jsonPath("$[0].title").value("Test Notification"));
    }

    @Test
    @WithMockUser
    void createNotification_returnsCreatedNotification() throws Exception {
        when(notificationService.createNotification(any(Notification.class), anyString()))
                .thenReturn(Mono.just(notification));

        mockMvc.perform(post("/notifications")
                .with(jwt().jwt(jwt -> jwt.subject(userId.toString())))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":\"" + userId + "\",\"title\":\"Test Notification\",\"message\":\"This is a test notification\",\"type\":\"property_added\",\"propertyTitle\":\"Test Property\"}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(notificationId.toString()))
                .andExpect(jsonPath("$.title").value("Test Notification"));
    }

    @Test
    @WithMockUser
    void markAsRead_returnsUpdatedNotification() throws Exception {
        Notification readNotification = new Notification();
        readNotification.setId(notificationId);
        readNotification.setUserId(userId);
        readNotification.setTitle("Test Notification");
        readNotification.setMessage("This is a test notification");
        readNotification.setType("property_added");
        readNotification.setPropertyTitle("Test Property");
        readNotification.setCreatedAt(LocalDateTime.now());
        readNotification.setRead(true);

        when(notificationService.markAsRead(eq(notificationId), anyString()))
                .thenReturn(Mono.just(readNotification));

        mockMvc.perform(patch("/notifications/" + notificationId + "/read")
                .with(jwt().jwt(jwt->jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(notificationId.toString()))
                .andExpect(jsonPath("$.read").value(true));
    }

    @Test
    @WithMockUser
    void deleteNotification_returnsNoContent() throws Exception {
        when(notificationService.deleteNotification(eq(notificationId), anyString()))
                .thenReturn(Mono.empty());

        mockMvc.perform(delete("/notifications/" + notificationId)
                .with(jwt().jwt(jwt-> jwt.subject(userId.toString())))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNoContent());
    }
}
