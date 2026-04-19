package com.crm.service;

import com.crm.dto.LoginDto;
import com.crm.dto.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}
