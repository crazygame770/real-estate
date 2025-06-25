package com.realestatetool.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class WebClientConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;
    
    @Value("${supabase.service-role-key}")
    private String supabaseServiceRoleKey;
    
    @Bean
    public WebClient supabaseWebClient() {
        // Increase memory buffer for larger payloads
        final int size = 16 * 1024 * 1024; // 16MB buffer (default is 256KB)
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
                
        return WebClient.builder()
                .baseUrl(supabaseUrl)
                .exchangeStrategies(strategies)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("apikey", supabaseAnonKey)
                .filter(logRequest())
                .build();
    }
    
    @Bean
    public WebClient adminSupabaseWebClient() {
        // Increase memory buffer for larger payloads
        final int size = 16 * 1024 * 1024; // 16MB buffer
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
                
        return WebClient.builder()
                .baseUrl(supabaseUrl)
                .exchangeStrategies(strategies)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("apikey", supabaseServiceRoleKey)
                .defaultHeader("Authorization", "Bearer " + supabaseServiceRoleKey)
                .filter(logRequest())
                .build();
    }
    
    // Log filter for debugging API calls
    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.debug("Request: {} {}", clientRequest.method(), clientRequest.url());
            return Mono.just(clientRequest);
        });
    }
}
