package com.zebvo.passportscraper.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TranslationService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    private final Map<String, String> languages = new LinkedHashMap<>() {{
        put("en", "English");
        put("hi", "Hindi");
        put("pa", "Punjabi");
        put("es", "Spanish");
        put("fr", "French");
        put("de", "German");
        put("ar", "Arabic");
        put("zh-CN", "Chinese");
        put("ru", "Russian");
        put("ja", "Japanese");
    }};

    public String translate(String text, String targetLang) {
        if (text == null || text.isEmpty() || "en".equals(targetLang)) {
            return text;
        }

        String cacheKey = text.hashCode() + "_" + targetLang;
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        try {
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String url = "https://translate.googleapis.com/translate_a/single" +
                    "?client=gtx&sl=auto&tl=" + targetLang + "&dt=t&q=" + encodedText;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                StringBuilder result = new StringBuilder();
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode sentences = root.get(0);

                if (sentences != null && sentences.isArray()) {
                    for (JsonNode sentence : sentences) {
                        if (sentence.isArray() && sentence.size() > 0) {
                            result.append(sentence.get(0).asText());
                        }
                    }
                }

                String translated = result.toString();
                if (!translated.isEmpty()) {
                    cache.put(cacheKey, translated);
                    return translated;
                }
            }
        } catch (Exception e) {
            System.err.println("Translation error: " + e.getMessage());
        }

        return text;
    }

    public Map<String, String> getSupportedLanguages() {
        return languages;
    }
}