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

    @GetMapping("/chonGhe.htm")
    public String chonGhe() {
        return "Brower/chonGhe";
    }

    @GetMapping("/menuLocation.htm")
    public String menuLocation() {
        return "Brower/menuLocation";
    }

    @GetMapping("/login.htm")
    public String login() {
        return "Brower/login";
    }

    @GetMapping("/dangkithanhvien.htm")
    public String dangkithanhvien() {
        return "Brower/dangkithanhvien";
    }

    @GetMapping("/thongtinthanhvien.htm")
    public String thongtinthanhvien() {
        return  "Brower/thongtinthanhvien";
    }

    @GetMapping("/conform.htm")
    public String conform() {
        return "Brower/conformInforandCombo";
    }

    @GetMapping("/payment.htm")
    public String payment() {
        return "Brower/payment";
    }

    @GetMapping("/showtimeCinema.htm")
    public String showtimeCinema() {
        return "Brower/movieShowTime";
    }

    @GetMapping("/cinema.htm")
    public String cinema() {
        return "Brower/cinema";
    }

    @GetMapping("/promotion.htm")
    public String promotion() {
        return "Brower/promotion";
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
