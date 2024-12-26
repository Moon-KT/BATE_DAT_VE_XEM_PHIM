package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.dto.UserDto;
import org.example.final_btl_datve.dto.VerificationCodeStorage;
import org.example.final_btl_datve.entity.Membership;
import org.example.final_btl_datve.entity.Role;
import org.example.final_btl_datve.entity.User;
import org.example.final_btl_datve.entity.enumModel.ERole;
import org.example.final_btl_datve.entity.enumModel.MembershipType;
import org.example.final_btl_datve.repository.MembershipRepository;
import org.example.final_btl_datve.repository.RoleRepository;
import org.example.final_btl_datve.repository.UserRepository;
import org.example.final_btl_datve.service.AuthService;
import org.example.final_btl_datve.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.naming.AuthenticationException;
import java.util.UUID;

@Component
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final VerificationCodeStorage verificationCodeStorage;
    private final MembershipRepository membershipRepository;
    private final RoleRepository roleRepository;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, VerificationCodeStorage verificationCodeStorage, MembershipRepository membershipRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCodeStorage = verificationCodeStorage;
        this.membershipRepository = membershipRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDto login(String email, String password) throws AuthenticationException {
        // Kiểm tra email và mật khẩu
        User userFind = userRepository.findByEmail(email);
        if(userFind.getRole().getRoleName().equals("ROLE_USER")){
            return  UserDto.builder()
                    .userId(userFind.getUserId()) // Lấy ID từ User
                    .email(userFind.getEmail())  // Lấy email từ User
                    .build();
        }

        if (userFind == null) {
            throw new AuthenticationException("Email không tồn tại!");
        }

        if (!passwordEncoder.matches(password, userFind.getPassword())) {
            throw new AuthenticationException("Sai mật khẩu!");
        }
        return UserDto.builder()
                .userId(userFind.getUserId()) // Lấy ID từ User
                .email(userFind.getEmail())  // Lấy email từ User
                .build();
    }

    @Override
    public Long register(RegisterDto registerDto) {
        if (userRepository.findByEmail(registerDto.getEmail()) != null) {
            throw new RuntimeException("Email đã tồn tại!");
        }
        Membership membership = membershipRepository.findById(1L) // NORMAL
                .orElseThrow(() -> new RuntimeException("Membership not found"));


        Role role = roleRepository.findById(2L) // ROLE_USER
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .username(registerDto.getUsername())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .email(registerDto.getEmail())
                .address(registerDto.getAddress())
                .phone(registerDto.getPhone())
                .gender(registerDto.getGender())
                .birthday(registerDto.getBirthday())
                .membership(membership)
                .role(role)
                .accumulatedPoints(0.0)
                .totalSpent(0.0)
                .creatAt(java.time.LocalDateTime.now())
                .enabled(true)
                .build();

        User saveUser = userRepository.save(user);

//        // Tạo và lưu mã xác thực
//        String verificationCode = generateVerificationCode();
//        verificationCodeStorage.storeVerificationCode(registerDto.getEmail(), verificationCode);

//        // Gửi email xác thực
//        emailService.sendVerificationEmail(user.getEmail(), "Verification Code", verificationCode);
//
//        System.out.println("Verification code for email " + user.getEmail() + ": " + verificationCode);
//
//        return "User registered successfully! Check your email for verification code.";

            return saveUser.getUserId();
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

