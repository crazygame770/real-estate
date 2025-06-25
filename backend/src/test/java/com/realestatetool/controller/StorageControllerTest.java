package com.realestatetool.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestatetool.service.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StorageController.class)
public class StorageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StorageService storageService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @WithMockUser
    void uploadFile_returnsFileName() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        when(storageService.uploadFile(any(), eq("property-images"), anyString()))
                .thenReturn(Mono.just("unique-filename-123.jpg"));

        // When & Then
        mockMvc.perform(multipart("/storage/upload/property-images")
                .file(file)
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fileName").value("unique-filename-123.jpg"));
    }

    @Test
    @WithMockUser
    void getPublicUrl_returnsUrl() throws Exception {
        // Given
        when(storageService.getPublicUrl(eq("property-images"), eq("image.jpg"), anyString()))
                .thenReturn(Mono.just("https://example.com/storage/property-images/image.jpg"));

        // When & Then
        mockMvc.perform(get("/storage/url/property-images/image.jpg")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicUrl")
                        .value("https://example.com/storage/property-images/image.jpg"));
    }

    @Test
    @WithMockUser
    void listFiles_returnsFilesList() throws Exception {
        // Given
        JsonNode mockResponse = objectMapper.createObjectNode()
                .put("name", "image.jpg")
                .put("id", "12345");

        when(storageService.listFiles(eq("property-images"), anyString()))
                .thenReturn(Mono.just(mockResponse));

        // When & Then
        mockMvc.perform(get("/storage/list/property-images")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("image.jpg"))
                .andExpect(jsonPath("$.id").value("12345"));
    }

    @Test
    @WithMockUser
    void deleteFile_returnsNoContent() throws Exception {
        // Given
        when(storageService.deleteFile(eq("property-images"), eq("image.jpg"), anyString()))
                .thenReturn(Mono.empty());

        // When & Then
        mockMvc.perform(delete("/storage/property-images/image.jpg")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNoContent());
    }
}
