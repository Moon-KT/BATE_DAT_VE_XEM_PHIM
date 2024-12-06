package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.ChangePasswordRequest;
import org.example.final_btl_datve.dto.LoginDto;
import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.dto.UserDto;
import org.example.final_btl_datve.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDTO) {
        String result = authService.register(registerDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String email, @RequestParam String verificationCode) {
        String result = authService.verifyEmail(email, verificationCode);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDTO) {
        try {
            // Gọi AuthService để thực hiện đăng nhập
            UserDto userDto = authService.login(loginDTO.getEmail(), loginDTO.getPassword());

            // Nếu đăng nhập thành công, trả về thông tin người dùng
            return ResponseEntity.ok(userDto);
        } catch (AuthenticationException e) {
            // Nếu đăng nhập thất bại, trả về mã lỗi và thông báo
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        } catch (javax.naming.AuthenticationException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgetPassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        String result = authService.resetPassword(changePasswordRequest.getEmail(), changePasswordRequest.getNewPassword());
        return result.equals("Password reset successful!") ?
                ResponseEntity.ok(result) :
                ResponseEntity.status(401).body(result);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("loggedIn", true));
        }
        return ResponseEntity.ok(Map.of("loggedIn", false));
    }
}
