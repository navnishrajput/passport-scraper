package com.zebvo.passportscraper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PassportScraperApplication {
    public static void main(String[] args) {
        SpringApplication.run(PassportScraperApplication.class, args);
    }
}