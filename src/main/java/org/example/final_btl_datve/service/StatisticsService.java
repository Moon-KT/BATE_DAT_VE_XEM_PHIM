package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.MovieViewData;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface StatisticsService {
    Long getTotalTicketSold();
    Double getTotalRevenue();
    List<MovieViewData> getTopMovie();
    List<Object[]> getCustomerBookingHistory();

    Long getTotalUser();
    Long getTotalMovie();

    Map<Integer, Double> getYearlySales(int year);
    Map<String, Double> getTopMoviesBySales(int month, int year);

    Map<Integer, Long> getTicketsByBookingMonth();
    Map<String, Long> getTicketsByMovie();
}
