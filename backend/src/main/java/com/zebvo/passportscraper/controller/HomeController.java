package com.zebvo.passportscraper.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("name", "Passport Social Media Scraper API");
        info.put("version", "1.0.0");
        info.put("status", "Running");
        info.put("timestamp", LocalDateTime.now());
        info.put("endpoints", new String[]{
            "/api/posts - Get all posts",
            "/api/search?keyword= - Search posts",
            "/api/stats - Get statistics",
            "/api/translate/{id}?targetLanguage= - Translate post",
            "/api/clusters - Get clustered posts",
            "/api/languages - Get supported languages",
            "/api/export/csv - Export as CSV"
        });
        return info;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("service", "Passport Scraper API");
        return status;
    }
}
