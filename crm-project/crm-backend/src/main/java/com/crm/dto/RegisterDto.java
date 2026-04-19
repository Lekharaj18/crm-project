package com.crm.dto;

import com.crm.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String fullName;
    private String email;
    private String password;
    private Role role;
}
