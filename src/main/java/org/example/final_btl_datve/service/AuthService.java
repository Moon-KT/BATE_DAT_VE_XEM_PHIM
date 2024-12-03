package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.RegisterDto;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    String login(String email, String password);
    String register(RegisterDto registerDto);
    String verifyEmail(String email, String verificationCode);
    String resetPassword(String email, String newPassword);
    void logout(String token);
}

