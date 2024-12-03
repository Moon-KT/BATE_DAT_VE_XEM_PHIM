package org.example.final_btl_datve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BrowerController {
    @GetMapping("/home/cinema")
    public String index() {
        return "User/GuiBetaCinema";
    }

    @GetMapping("/home.htm")
    public String home() {
        return "Brower/home";
    }

    @GetMapping("/movie.htm")
    public String movie1() {
        return "Brower/movie";
    }

    @GetMapping("/login.htm")
    public String login() {
        return "Brower/login";
    }

    @GetMapping("/sign.htm")
    public String sign() {
        return "Brower/sign";
    }

    @GetMapping("/forget-password.htm")
    public String forgetPassword1() {
        return "Brower/forget-password";
    }

    @GetMapping("/chitietphim.htm")
    public String chitietphim() {
        return "Brower/chitietphim";
    }

    @GetMapping("/home/movie")
    public String movie() {
        return "User/movie";
    }

    @GetMapping("/home/login")
    public String ticket() {
        return "User/login";
    }

    @GetMapping("/home/sign")
    public String register() {
        return "User/sign";
    }

    @GetMapping("/home/forget-password")
    public String forgetPassword() {
        return "User/forget-password";
    }

    @GetMapping("/home/chitietphim")
    public String homed() {
        return "User/chitietphim";
    }
}
