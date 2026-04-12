package com.dualnet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Startpunkt der Spring Boot Anwendung
@SpringBootApplication
public class DualNetApplication {

    public static void main(String[] args) {
        // Startet den eingebetteten Webserver und die gesamte Anwendung
        SpringApplication.run(DualNetApplication.class, args);
    }
}
