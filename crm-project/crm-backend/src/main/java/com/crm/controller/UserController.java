package com.crm.controller;

import com.crm.model.User;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        User user = userRepository.findByEmail(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        // Ideally we shouldn't send the password back
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
