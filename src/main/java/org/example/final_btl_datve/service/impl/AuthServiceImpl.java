package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.dto.VerificationCodeStorage;
import org.example.final_btl_datve.entity.Membership;
import org.example.final_btl_datve.entity.User;
import org.example.final_btl_datve.entity.enumModel.MembershipType;
import org.example.final_btl_datve.repository.UserRepository;
import org.example.final_btl_datve.service.AuthService;
import org.example.final_btl_datve.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final VerificationCodeStorage verificationCodeStorage;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, VerificationCodeStorage verificationCodeStorage) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCodeStorage = verificationCodeStorage;
    }

    @Override
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if(!user.getEnabled()){
            return "Please verify your email first!";
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
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
                .membership(Membership.builder().membership_type(MembershipType.valueOf("NORMAL")).build())
                .enabled(false)
                .build();

        userRepository.save(user);

        // Tạo và lưu mã xác thực
        String verificationCode = generateVerificationCode();
        verificationCodeStorage.storeVerificationCode(registerDto.getEmail(), verificationCode);

        // Gửi email xác thực
        emailService.sendVerificationEmail(user.getEmail(), "Verification Code", verificationCode);

        System.out.println("Verification code for email " + user.getEmail() + ": " + verificationCode);

        return "User registered successfully! Check your email for verification code.";
    }

    @Override
    public String resetPassword(String email, String newPassword) {
        try {
            User user = userRepository.findByEmail(email);

            if (user != null) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                // Log sự kiện (nếu cần)
                System.out.println("Password reset successfully for email: " + email);
                return "Password reset successful!";
            }
            return "Email not found!";
        } catch (Exception e) {
            // Log lỗi
            System.err.println("Error while resetting password: " + e.getMessage());
            return "An error occurred while resetting the password. Please try again later.";
        }
    }

    @Override
    public void logout(String token) {
        // remove token from cache
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }

    @Override
    public String verifyEmail(String email, String verificationCode) {
        User user = userRepository.findByEmail(email);

        if (user != null) {
            // Lấy mã xác thực từ bộ lưu trữ tạm thời
            String storedCode = verificationCodeStorage.getVerificationCode(email);

            if (storedCode != null && storedCode.equals(verificationCode)) {
                user.setEnabled(true);
                userRepository.save(user);
                verificationCodeStorage.removeVerificationCode(email); // Xóa mã sau khi xác thực thành công
                return "Email verified successfully for email: " + email;
            } else {
                return "Invalid verification code!";
            }
        } else {
            return "Email not found!";
        }
    }
}

