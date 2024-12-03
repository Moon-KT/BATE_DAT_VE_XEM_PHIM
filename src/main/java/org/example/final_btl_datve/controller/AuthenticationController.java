package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.ChangePasswordRequest;
import org.example.final_btl_datve.dto.LoginDto;
import org.example.final_btl_datve.dto.RegisterDto;
import org.example.final_btl_datve.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> login(@RequestBody LoginDto loginDTO) {
        String result = authService.login(loginDTO.getEmail(), loginDTO.getPassword());

        return result.equals("Login successful!") ?
                ResponseEntity.ok(result) :
                ResponseEntity.status(401).body(result);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgetPassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        String result = authService.resetPassword(changePasswordRequest.getEmail(), changePasswordRequest.getNewPassword());
        return result.equals("Password reset successful!") ?
                ResponseEntity.ok(result) :
                ResponseEntity.status(401).body(result);
    }
}
