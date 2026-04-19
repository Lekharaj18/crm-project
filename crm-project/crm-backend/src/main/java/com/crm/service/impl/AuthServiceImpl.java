package com.crm.service.impl;

import com.crm.dto.LoginDto;
import com.crm.dto.RegisterDto;
import com.crm.model.User;
import com.crm.repository.UserRepository;
import com.crm.security.JwtTokenProvider;
import com.crm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtTokenProvider.generateToken(authentication);
    }

    @Override
    public String register(RegisterDto registerDto) {
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        
        // Ensure default role is USER/SALES if not provided, else what's provided
        if(registerDto.getRole() == null) {
            user.setRole(com.crm.model.Role.ROLE_SALES);
        } else {
            user.setRole(registerDto.getRole());
        }

        userRepository.save(user);

        return "User registered successfully!.";
    }
}
