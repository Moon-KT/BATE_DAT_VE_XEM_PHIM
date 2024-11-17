package org.example.final_btl_datve.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class MainController {
    @GetMapping("/login")
    public String login() {
        return "/login";
    }

    @GetMapping("/home")
    public String home() {
        return "/index";
    }

    @GetMapping("forget-password")
    public String forgetPassword() {
        return "/forget-password";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "/login";
    }

    @GetMapping("/user")
    public String user() {
        return "/user";
    }

    @GetMapping("/movie")
    public String movie() {
        return "/movie";
    }

    @GetMapping("/test")
    public String test() {
        return "/test";
    }

    @GetMapping("/ticket")
    public String ticket() {
        return "/ticket";
    }

    @GetMapping("/cinema")
    public String cinema() {
        return "/cinema";
    }

    @GetMapping("/room")
    public String room() {
        return "/room";
    }

    @GetMapping("/showtime")
    public String showtime() {
        return "/showtime";
    }

    @GetMapping("/gift")
    public String gift() {
        return "/gift";
    }

    @GetMapping("/total")
    public String total() {
        return "/total";
    }
    // Kiem tra nguoi dung va phan quyen hien tai
    @GetMapping("/auth")
    public String auth(Model model, Principal principal, Authentication authentication) {
        String userName = principal.getName();
        model.addAttribute("userInfo", userName);
        model.addAttribute("userRole", authentication.getAuthorities());
        return "/auth";
    }
}
