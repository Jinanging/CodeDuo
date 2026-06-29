package com.codeduo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class CodeDuoApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodeDuoApplication.class, args);
    }
}
