package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.entity.User;
import org.example.final_btl_datve.entity.enumModel.ERole;
import org.example.final_btl_datve.repository.UserRepository;
import org.example.final_btl_datve.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return "Login successful!";
        }
        return "Invalid username or password!";
    }

    @Override
    public String register(RegisterDto registerDto) {
        if (userRepository.findByEmail(registerDto.getEmail()) != null) {
            return "Username already exists!";
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .email(registerDto.getEmail())
                .address(registerDto.getAddress())
                .phone(registerDto.getPhone())
                .gender(registerDto.getGender())
                .birthday(registerDto.getBirthday())
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    public String resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        System.out.println(user + " " + email + " " + newPassword);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password reset successful!";
        }
        return "Email not found!";
    }

    @Override
    public void logout(String token) {
        // remove token from cache

    }
}

