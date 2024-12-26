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
        return "Admin/login";
    }

    @GetMapping("/home")
    public String home() {
        return "Admin/index";
    }

    @GetMapping("forget-password")
    public String forgetPassword() {
        return "Admin/forget-password";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Admin/login";
    }

    @GetMapping("/user")
    public String user() {
        return "Admin/user";
    }

    @GetMapping("/movie")
    public String movie() {
        return "Admin/movie";
    }

    @GetMapping("/ticket")
    public String ticket() {
        return "Admin/ticket";
    }

    @GetMapping("/cinema")
    public String cinema() {
        return "Admin/cinema";
    }

    @GetMapping("/room")
    public String room() {
        return "Admin/room";
    }

    @GetMapping("/showtime")
    public String showtime() {
        return "Admin/showtime";
    }

    @GetMapping("/gift")
    public String gift() {
        return "Admin/gift";
    }

    @GetMapping("/total")
    public String total() {
        return "Admin/total";
    }

    @GetMapping("/test")
    public String test() {
        return "User/test";
    }

    @GetMapping("/test2")
    public String test2() {
        return "Admin/test.ticket";
    }

    // Kiem tra nguoi dung va phan quyen hien tai
    @GetMapping("/auth")
    public String auth(Model model, Principal principal, Authentication authentication) {
        String userName = principal.getName();
        model.addAttribute("userInfo", userName);
        model.addAttribute("userRole", authentication.getAuthorities());
        return "Admin/auth";
    }
}
