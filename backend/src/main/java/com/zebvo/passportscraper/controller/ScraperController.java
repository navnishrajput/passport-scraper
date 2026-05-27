package com.zebvo.passportscraper.controller;

import com.zebvo.passportscraper.model.SocialMediaPost;
import com.zebvo.passportscraper.repository.SocialMediaPostRepository;
import com.zebvo.passportscraper.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScraperController {
    
    @Autowired
    private SocialMediaPostRepository repository;
    
    @Autowired
    private TranslationService translationService;
    
    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String sentiment,
            @RequestParam(required = false) String sortBy) {
        
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<SocialMediaPost> posts = repository.findFilteredPosts(since, platform, category, region, sentiment);
        
        if ("engagement".equals(sortBy)) {
            posts.sort((a, b) -> Integer.compare(
                b.getLikes() + b.getComments() + b.getShares(),
                a.getLikes() + a.getComments() + a.getShares()));
        } else if ("relevance".equals(sortBy)) {
            posts.sort((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()));
        }
        
        int start = page * size;
        int end = Math.min(start + size, posts.size());
        List<SocialMediaPost> paginated = start < posts.size() ? posts.subList(start, end) : new ArrayList<>();
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("posts", paginated);
        response.put("total", posts.size());
        response.put("page", page);
        response.put("totalPages", (int) Math.ceil((double) posts.size() / size));
        response.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<SocialMediaPost> posts = repository.searchPosts(since, keyword);
        
        int start = page * size;
        int end = Math.min(start + size, posts.size());
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("posts", start < posts.size() ? posts.subList(start, end) : new ArrayList<>());
        response.put("total", posts.size());
        response.put("keyword", keyword);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPosts", repository.countRecentPosts(since));
        stats.put("platforms", repository.countDistinctPlatforms(since));
        stats.put("platformStats", convertStats(repository.getPlatformStats(since)));
        stats.put("categoryStats", convertStats(repository.getCategoryStats(since)));
        stats.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/translate/{postId}")
    public ResponseEntity<Map<String, Object>> translatePost(
            @PathVariable Long postId,
            @RequestParam String targetLanguage) {
        
        Optional<SocialMediaPost> postOpt = repository.findById(postId);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        SocialMediaPost post = postOpt.get();
        String translatedContent = translationService.translate(post.getContent(), targetLanguage);
        String translatedSummary = post.getSummary() != null ? 
            translationService.translate(post.getSummary(), targetLanguage) : "";
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("original", post.getContent());
        result.put("translated", translatedContent);
        result.put("originalSummary", post.getSummary());
        result.put("translatedSummary", translatedSummary);
        result.put("language", targetLanguage);
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/languages")
    public ResponseEntity<Map<String, String>> getLanguages() {
        return ResponseEntity.ok(translationService.getSupportedLanguages());
    }
    
    @GetMapping("/clusters")
    public ResponseEntity<Map<String, List<SocialMediaPost>>> getClusters() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<SocialMediaPost> posts = repository.findRecentPosts(since);
        
        Map<String, List<SocialMediaPost>> clusters = posts.stream()
            .collect(Collectors.groupingBy(
                p -> p.getCategory() + " | " + p.getRegion(),
                LinkedHashMap::new,
                Collectors.toList()
            ));
        
        return ResponseEntity.ok(clusters);
    }
    
    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCSV(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region) {
        
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<SocialMediaPost> posts = repository.findFilteredPosts(since, platform, category, region, null);
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Platform,Author,Title,Category,Region,Sentiment,Date,URL\n");
        
        for (SocialMediaPost p : posts) {
            csv.append(String.format("%d,%s,%s,%s,%s,%s,%s,%s,%s\n",
                p.getId(),
                escapeCSV(p.getPlatform()),
                escapeCSV(p.getAuthor()),
                escapeCSV(p.getTitle()),
                escapeCSV(p.getCategory()),
                escapeCSV(p.getRegion()),
                escapeCSV(p.getSentiment()),
                p.getCreatedAt(),
                escapeCSV(p.getUrl())
            ));
        }
        
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=passport-posts.csv")
            .contentType(MediaType.TEXT_PLAIN)
            .body(csv.toString());
    }
    
    private Map<String, Long> convertStats(List<Object[]> stats) {
        Map<String, Long> result = new LinkedHashMap<>();
        if (stats != null) {
            for (Object[] row : stats) {
                result.put((String) row[0], (Long) row[1]);
            }
        }
        return result;
    }
    
    private String escapeCSV(String value) {
        if (value == null) return "";
        return value.replace("\"", "\"\"").replace(",", ";");
    }
}