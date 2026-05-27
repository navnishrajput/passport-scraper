package com.zebvo.passportscraper.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "social_media_posts", indexes = {
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_platform", columnList = "platform"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_is_spam", columnList = "isSpam")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialMediaPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 50)
    private String platform;
    
    @Column(length = 1000)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 200)
    private String author;
    
    @Column(columnDefinition = "TEXT")
    private String url;
    
    @Column(length = 50)
    private String region;
    
    @Column(length = 10)
    private String language;
    
    @Column(length = 50)
    private String category;
    
    @Column(length = 20)
    private String sentiment;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    private int likes;
    private int comments;
    private int shares;
    
    @Column(name = "is_spam")
    private boolean isSpam;
    
    @Column(name = "relevance_score")
    private double relevanceScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "scraped_at")
    private LocalDateTime scrapedAt;
    
    @PrePersist
    protected void onCreate() {
        if (scrapedAt == null) scrapedAt = LocalDateTime.now();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
