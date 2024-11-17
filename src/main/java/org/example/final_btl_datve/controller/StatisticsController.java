package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.service.BookingService;
import org.example.final_btl_datve.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;
    private final BookingService bookingService;

    public StatisticsController(StatisticsService statisticsService,  BookingService bookingService) {
        this.statisticsService = statisticsService;
        this.bookingService = bookingService;
    }

    @GetMapping("/total-ticket-sold")
    public ResponseEntity<Long> getTotalTicketSold() {
        return ResponseEntity.ok(statisticsService.getTotalTicketSold());
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(statisticsService.getTotalRevenue());
    }

    @GetMapping("/total-user")
    public ResponseEntity<Long> getTotalUser() {
        return ResponseEntity.ok(statisticsService.getTotalUser());
    }

    @GetMapping("/total-movie")
    public ResponseEntity<Long> getTotalMovie() {
        return ResponseEntity.ok(statisticsService.getTotalMovie());
    }

    @GetMapping("/top-movie")
    public ResponseEntity<?> getTopMovie() {
        return ResponseEntity.ok(statisticsService.getTopMovie());
    }

    @GetMapping("/yearly-sales")
    public Map<Integer, Double> getYearlySales(@RequestParam int year) {
        return statisticsService.getYearlySales(year);
    }

    @GetMapping("/top-movies/{month}/{year}")
    public ResponseEntity<Map<String, Double>> getTopMoviesBySales(@PathVariable int month, @PathVariable int year) {
        Map<String, Double> movieSales = statisticsService.getTopMoviesBySales(month, year);
        return ResponseEntity.ok(movieSales);
    }

    @GetMapping("/customer-booking-history")
    public ResponseEntity<List<Object[]>> getCustomerBookingHistory() {
        List<Object[]> customerHistory = statisticsService.getCustomerBookingHistory();
        return ResponseEntity.ok(customerHistory);
    }


    @GetMapping("/ticket-sold-by-month")
    public ResponseEntity<?> getTicketSoldByMonth() {
        return ResponseEntity.ok(statisticsService.getTicketsByBookingMonth());
    }

    @GetMapping("/tickets-by-movie")
    public ResponseEntity<Map<String, Long>> getTicketsByMovie() {
        Map<String, Long> ticketsByMovie = statisticsService.getTicketsByMovie();
        return ResponseEntity.ok(ticketsByMovie);
    }



}
