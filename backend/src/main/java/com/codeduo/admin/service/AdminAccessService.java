package com.codeduo.admin.service;

import com.codeduo.global.exception.BusinessException;
import com.codeduo.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminAccessService {
    private final Set<String> adminEmails;

    public AdminAccessService(
            @Value("${app.admin.emails:}") String adminEmails,
            @Value("${app.admin.bootstrap-email:}") String bootstrapEmail
    ) {
        String configuredEmails = adminEmails + "," + bootstrapEmail;
        this.adminEmails = Arrays.stream(configuredEmails.split(","))
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .map(email -> email.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
    }

    public void requireAdmin(User user) {
        if (user == null || !adminEmails.contains(user.getEmail().toLowerCase(Locale.ROOT))) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "관리자 권한이 필요합니다.");
        }
    }
}
