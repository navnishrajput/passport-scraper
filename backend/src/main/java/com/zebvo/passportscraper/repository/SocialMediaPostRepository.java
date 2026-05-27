package com.zebvo.passportscraper.repository;

import com.zebvo.passportscraper.model.SocialMediaPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SocialMediaPostRepository extends JpaRepository<SocialMediaPost, Long> {
    
    boolean existsByUrl(String url);
    
    @Query("SELECT p FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false ORDER BY p.createdAt DESC")
    List<SocialMediaPost> findRecentPosts(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false " +
           "AND (:platform IS NULL OR p.platform = :platform) " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:region IS NULL OR p.region = :region) " +
           "AND (:sentiment IS NULL OR p.sentiment = :sentiment) " +
           "ORDER BY p.createdAt DESC")
    List<SocialMediaPost> findFilteredPosts(
        @Param("since") LocalDateTime since,
        @Param("platform") String platform,
        @Param("category") String category,
        @Param("region") String region,
        @Param("sentiment") String sentiment
    );
    
    @Query("SELECT p FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY p.createdAt DESC")
    List<SocialMediaPost> searchPosts(@Param("since") LocalDateTime since, @Param("keyword") String keyword);
    
    @Query("SELECT COUNT(p) FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false")
    long countRecentPosts(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(DISTINCT p.platform) FROM SocialMediaPost p WHERE p.createdAt >= :since")
    long countDistinctPlatforms(@Param("since") LocalDateTime since);
    
    @Query("SELECT p.platform, COUNT(p) FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false GROUP BY p.platform")
    List<Object[]> getPlatformStats(@Param("since") LocalDateTime since);
    
    @Query("SELECT p.category, COUNT(p) FROM SocialMediaPost p WHERE p.createdAt >= :since AND p.isSpam = false GROUP BY p.category")
    List<Object[]> getCategoryStats(@Param("since") LocalDateTime since);
    
    @Modifying
    @Query("DELETE FROM SocialMediaPost p WHERE p.createdAt < :date")
    int deleteOlderThan(@Param("date") LocalDateTime date);
}