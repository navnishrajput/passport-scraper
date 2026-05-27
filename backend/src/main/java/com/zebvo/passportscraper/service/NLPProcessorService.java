package com.zebvo.passportscraper.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NLPProcessorService {

    private final Map<String, List<String>> categoryKeywords = new LinkedHashMap<>();
    private final Map<String, Integer> sentimentWords = new HashMap<>();
    private final Set<String> stopWords = new HashSet<>();

    public NLPProcessorService() {
        initializeCategories();
        initializeSentiment();
        initializeStopWords();
    }

    private void initializeCategories() {
        categoryKeywords.put("Application Process", Arrays.asList(
                "apply", "application", "form", "submit", "documents", "required",
                "online", "portal", "website", "fill", "upload", "process", "fee", "fees"
        ));
        categoryKeywords.put("Passport Renewal", Arrays.asList(
                "renew", "renewal", "expire", "expiry", "expiring", "renewing",
                "extension", "extend", "validity", "reissue"
        ));
        categoryKeywords.put("Appointment Booking", Arrays.asList(
                "appointment", "slot", "booking", "schedule", "date", "available",
                "psk", "passport seva kendra", "rpo", "waiting", "queue"
        ));
        categoryKeywords.put("Tatkal Service", Arrays.asList(
                "tatkal", "urgent", "emergency", "express", "fast", "quick",
                "priority", "expedited", "immediate"
        ));
        categoryKeywords.put("Visa Related", Arrays.asList(
                "visa", "stamp", "stamping", "immigration", "embassy", "consulate",
                "schengen", "tourist", "work permit", "student visa", "e-visa"
        ));
        categoryKeywords.put("Travel Issues", Arrays.asList(
                "travel", "flight", "airport", "immigration check", "border",
                "customs", "baggage", "delay", "cancelled", "stranded"
        ));
        categoryKeywords.put("Government Announcements", Arrays.asList(
                "government", "ministry", "mea", "official", "circular", "notification",
                "gazette", "policy", "rule", "regulation", "mandatory"
        ));
        categoryKeywords.put("Scams and Fraud", Arrays.asList(
                "scam", "fraud", "fake", "cheat", "money", "agent", "middleman",
                "illegal", "blacklist", "warning", "alert", "beware"
        ));
        categoryKeywords.put("Police Verification", Arrays.asList(
                "police", "verification", "background check", "clearance",
                "investigation", "criminal", "character certificate"
        ));
        categoryKeywords.put("Personal Experiences", Arrays.asList(
                "experience", "story", "journey", "my", "got", "received", "finally",
                "happy", "frustrated", "struggle", "waiting since"
        ));
    }

    private void initializeSentiment() {
        String[] positive = {"good", "great", "excellent", "amazing", "wonderful",
                "fantastic", "happy", "pleased", "smooth", "easy", "quick", "fast",
                "helpful", "efficient", "successful", "approved", "received", "finally",
                "thank", "best", "love", "perfect", "impressive", "outstanding"};
        String[] negative = {"bad", "terrible", "awful", "horrible", "worst", "sad",
                "angry", "frustrated", "difficult", "hard", "slow", "delay", "rejected",
                "denied", "problem", "issue", "complain", "complaint", "never", "failed",
                "poor", "pathetic", "useless", "waste"};

        for (String word : positive) sentimentWords.put(word, 1);
        for (String word : negative) sentimentWords.put(word, -1);
    }

    private void initializeStopWords() {
        String[] stops = {"the", "a", "an", "and", "or", "but", "in", "on", "at",
                "to", "for", "of", "with", "by", "from", "is", "are", "was", "were",
                "be", "been", "being", "have", "has", "had", "do", "does", "did",
                "will", "would", "shall", "should", "may", "might", "must", "can",
                "could", "i", "me", "my", "we", "our", "you", "your", "he", "she",
                "it", "they", "them", "this", "that", "these", "those", "am", "no",
                "not", "nor", "too", "very", "just", "don", "now", "then", "here"};
        stopWords.addAll(Arrays.asList(stops));
    }

    public String categorizePost(String content) {
        if (content == null || content.isEmpty()) return "Uncategorized";
        content = content.toLowerCase();
        Map<String, Integer> scores = new HashMap<>();

        for (Map.Entry<String, List<String>> entry : categoryKeywords.entrySet()) {
            int score = 0;
            for (String keyword : entry.getValue()) {
                int count = countOccurrences(content, keyword);
                score += count * (keyword.contains(" ") ? 3 : 1);
            }
            if (score > 0) scores.put(entry.getKey(), score);
        }

        return scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("General News");
    }

    public String generateSummary(String content) {
        if (content == null || content.isEmpty()) return "";
        String[] sentences = content.split("[.!?]+");
        if (sentences.length == 0) {
            return truncateWords(content, 30);
        }

        String firstSentence = sentences[0].trim();
        String[] words = firstSentence.split("\\s+");

        if (words.length <= 30) return firstSentence;
        return truncateWords(firstSentence, 30);
    }

    public boolean isSpam(String content) {
        if (content == null || content.isEmpty()) return true;
        content = content.toLowerCase();
        int spamScore = 0;

        String[] spamPatterns = {
                "buy now", "click here", "free money", "winner", "congratulations",
                "limited offer", "act now", "subscribe now", "follow me",
                "check my profile", "dm me", "whatsapp", "telegram group",
                "guaranteed", "100% free", "cash prize", "lottery", "click below"
        };

        for (String pattern : spamPatterns) {
            if (content.contains(pattern)) spamScore++;
        }

        int urlCount = countOccurrences(content, "http");
        if (urlCount > 3) spamScore += 2;

        int capsCount = content.replaceAll("[^A-Z]", "").length();
        int totalLetters = content.replaceAll("[^a-zA-Z]", "").length();
        if (totalLetters > 0 && (double) capsCount / totalLetters > 0.7) spamScore += 2;

        return spamScore >= 3;
    }

    public String analyzeSentiment(String content) {
        if (content == null || content.isEmpty()) return "Neutral";
        content = content.toLowerCase();
        double score = 0;
        int wordCount = 0;

        for (String word : content.split("\\s+")) {
            word = word.replaceAll("[^a-zA-Z]", "");
            Integer sentiment = sentimentWords.get(word);
            if (sentiment != null) {
                score += sentiment;
                wordCount++;
            }
        }

        if (wordCount == 0) return "Neutral";
        double avg = score / wordCount;
        if (avg > 0.1) return "Positive";
        if (avg < -0.1) return "Negative";
        return "Neutral";
    }

    public String detectLanguage(String content) {
        if (content == null) return "en";
        if (content.matches(".*[\\u0900-\\u097F].*")) return "hi";
        if (content.matches(".*[\\u0A00-\\u0A7F].*")) return "pa";
        if (content.matches(".*[\\u0600-\\u06FF].*")) return "ar";
        if (content.matches(".*[\\u4E00-\\u9FFF].*")) return "zh";
        if (content.matches(".*[\\u0400-\\u04FF].*")) return "ru";
        return "en";
    }

    public String detectRegion(String content) {
        if (content == null) return "Global";
        content = content.toLowerCase();
        if (content.contains("india") || content.contains("delhi") || content.contains("mumbai") ||
                content.contains("tatkal") || content.contains("passport seva")) return "India";
        if (content.contains("usa") || content.contains("america") || content.contains("united states")) return "USA";
        if (content.contains("uk") || content.contains("london") || content.contains("britain")) return "UK";
        if (content.contains("canada") || content.contains("toronto")) return "Canada";
        if (content.contains("australia") || content.contains("sydney")) return "Australia";
        if (content.contains("uae") || content.contains("dubai")) return "UAE";
        if (content.contains("singapore")) return "Singapore";
        return "Global";
    }

    public double calculateRelevance(String content) {
        if (content == null) return 0;
        content = content.toLowerCase();
        double score = 0;
        if (content.contains("passport seva")) score += 30;
        if (content.contains("passport application")) score += 25;
        if (content.contains("passport renewal")) score += 25;
        if (content.contains("tatkal")) score += 20;
        if (content.contains("visa application")) score += 20;
        if (content.contains("passport")) score += 10;
        if (content.contains("visa")) score += 8;
        if (content.contains("government")) score += 5;
        if (content.contains("ministry")) score += 5;
        return Math.min(100, score);
    }

    private int countOccurrences(String text, String keyword) {
        int count = 0;
        int index = 0;
        while ((index = text.indexOf(keyword, index)) != -1) {
            count++;
            index += keyword.length();
        }
        return count;
    }

    private String truncateWords(String text, int maxWords) {
        String[] words = text.split("\\s+");
        return Arrays.stream(words).limit(maxWords).collect(Collectors.joining(" ")) + "...";
    }
}