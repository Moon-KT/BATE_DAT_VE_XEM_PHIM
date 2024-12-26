package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.dto.UserDto;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;

@Service
public interface AuthService {
    UserDto login(String email, String password) throws AuthenticationException;
    Long register(RegisterDto registerDto);
    String verifyEmail(String email, String verificationCode);
    String resetPassword(String email, String newPassword);
    void logout(String token);
}

