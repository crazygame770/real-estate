package com.realestatetool.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.realestatetool.dto.SystemStatsDTO;
import com.realestatetool.model.Property;
import com.realestatetool.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getAllUsers_returnsUsersList() throws Exception {
        // Given
        ObjectNode userNode = objectMapper.createObjectNode();
        userNode.put("id", UUID.randomUUID().toString());
        userNode.put("email", "test@example.com");
        
        JsonNode mockResponse = objectMapper.createArrayNode().add(userNode);

        when(adminService.getAllUsers()).thenReturn(Mono.just(mockResponse));

        // When & Then
        mockMvc.perform(get("/admin/users")
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getUserById_returnsUser() throws Exception {
        // Given
        String userId = UUID.randomUUID().toString();
        
        ObjectNode userNode = objectMapper.createObjectNode();
        userNode.put("id", userId);
        userNode.put("email", "test@example.com");

        when(adminService.getUserById(eq(userId))).thenReturn(Mono.just(userNode));

        // When & Then
        mockMvc.perform(get("/admin/users/" + userId)
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(roles = {"ADMIN"})
    void executeQuery_returnsQueryResult() throws Exception {
        // Given
        String sql = "SELECT * FROM users LIMIT 5";
        
        ObjectNode resultNode = objectMapper.createObjectNode();
        resultNode.put("result", "success");

        when(adminService.executeQuery(eq(sql))).thenReturn(Mono.just(resultNode));

        // When & Then
        mockMvc.perform(post("/admin/query")
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(sql)
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getPropertiesByCustomQuery_returnsProperties() throws Exception {
        // Given
        Property property = new Property();
        property.setId(UUID.randomUUID());
        property.setAddress("123 Test St");
        property.setPrice(new BigDecimal("250000.00"));
        property.setListingDate(LocalDate.now());

        when(adminService.getPropertiesByCustomQuery(anyString())).thenReturn(Mono.just(List.of(property)));

        // When & Then
        mockMvc.perform(get("/admin/properties/custom")
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .param("query", "price > 200000")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(roles = {"ADMIN"})
    void createStorageBucket_returnsCreated() throws Exception {
        // Given
        when(adminService.createStorageBucket(anyString())).thenReturn(Mono.empty());

        // When & Then
        mockMvc.perform(post("/admin/storage/buckets")
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"new-bucket\"}")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated());
    }
    
    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getSystemStats_returnsStats() throws Exception {
        // Given
//        Map<String, Object> stats = Map.of(
//                "total_properties", 100,
//                "total_users", 50,
//                "avg_price", 275000.0
//        );
        SystemStatsDTO stats = new SystemStatsDTO();
        stats.setTotalProperties(100);
        stats.setTotalUsers(50);
        stats.setAvgPrice(275000.0);

// Optional: handle nulls or defaults if needed

        when(adminService.getSystemStats()).thenReturn(Mono.just(stats));

        // When & Then
        mockMvc.perform(get("/admin/stats")
                .with(jwt().authorities(() -> "ROLE_ADMIN"))
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total_properties").value(100))
                .andExpect(jsonPath("$.total_users").value(50))
                .andExpect(jsonPath("$.avg_price").value(275000.0));
    }
}
