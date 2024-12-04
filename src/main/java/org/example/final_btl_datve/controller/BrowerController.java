package org.example.final_btl_datve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BrowerController {
    @GetMapping("/home.htm")
    public String home() {
        return "Brower/home";
    }

    @GetMapping("/movie.htm")
    public String movie1() {
        return "Brower/movie";
    }

    @GetMapping("/chitietphim.htm")
    public String chitietphim() {
        return "Brower/chitietphim";
    }

    @GetMapping("phim.htm")
    public String phim() {
        return "Brower/phim";
    }

    @GetMapping("/menuLocation.htm")
    public String menuLocation() {
        return "Brower/menuLocation";
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

    @GetMapping("/test.htm")
    public String test() {
        return "Brower/test";
    }
}
