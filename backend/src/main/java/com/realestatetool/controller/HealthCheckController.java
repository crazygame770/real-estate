package com.realestatetool.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/actuator/health")
@RequiredArgsConstructor
public class HealthCheckController {

    private final Optional<BuildProperties> buildProperties;

    @GetMapping
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "version", buildProperties.map(BuildProperties::getVersion).orElse("unknown"),
            "timestamp", System.currentTimeMillis()
        );
    }
}
