package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.MovieViewData;
import org.example.final_btl_datve.entity.Booking;
import org.example.final_btl_datve.entity.Movie;
import org.example.final_btl_datve.repository.BookingRepository;
import org.example.final_btl_datve.repository.MovieRepository;
import org.example.final_btl_datve.repository.UserRepository;
import org.example.final_btl_datve.service.StatisticsService;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class StatisticsServiceImpl implements StatisticsService {
    private final MovieRepository movieRepository;

    private final BookingRepository bookingRepository;

    private final UserRepository userRepository;

    public StatisticsServiceImpl(MovieRepository movieRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Long getTotalTicketSold() {
        List<Booking> bookings = bookingRepository.findAll();
        Long total= 0L;
        for (Booking booking : bookings) {
            total += booking.getBooking_seats().size();
        }
        return total;
    }

    @Override
    public Double getTotalRevenue() {
        List<Booking> bookings = bookingRepository.findAll();
        Double total = bookings.stream().mapToDouble(Booking::getTotalPrice).sum();
        return Math.round(total*100.0)/100.0;
    }

    @Override
    public Long getTotalUser() {
        return userRepository.count();
    }

    @Override
    public Long getTotalMovie() {
        return movieRepository.count();
    }

    @Override
    public List<MovieViewData> getTopMovie() {
        // Lấy tất cả các booking
        List<Booking> bookings = bookingRepository.findAll();

        // Tạo một Map để nhóm theo Movie và tính toán views
        Map<Movie, Long> movieViewsMap = bookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getShowtime().getMovie(), // Lấy Movie từ Showtime
                        Collectors.summingLong(booking -> booking.getBooking_seats().size()) // Tính tổng số ghế cho mỗi phim
                ));

        // Chuyển Map thành một danh sách MovieViewData chứa thông tin về tên, thể loại, thời gian và views
        List<MovieViewData> movieViewDataList = movieViewsMap.entrySet().stream()
                .map(entry -> {
                    Movie movie = entry.getKey();
                    Long views = entry.getValue();

                    // Tạo MovieViewData cho mỗi phim với thông tin tên, thể loại, thời gian và lượt xem
                    MovieViewData movieViewData = new MovieViewData();
                    movieViewData.setName(movie.getMovieName());
                    movieViewData.setPoster(movie.getMoviePoster());
                    movieViewData.setDuration(movie.getMovieDuration());
                    movieViewData.setViews(views);

                    // Lấy thể loại từ movie_genre
                    List<String> genres = movie.getMovie_genreList().stream()
                            .map(movieGenre -> movieGenre.getGenre().getGenreName()) // Lấy tên thể loại
                            .collect(Collectors.toList());

                    movieViewData.setGenres(genres);
                    return movieViewData;
                })
                .sorted(Comparator.comparingLong(MovieViewData::getViews).reversed()) // Sắp xếp theo views từ cao đến thấp
                .limit(5) // Lấy 5 phim hot nhất
                .collect(Collectors.toList());
        return movieViewDataList;
    }

    @Override
    public List<Object[]> getCustomerBookingHistory() {
        return userRepository.getCustomerBookingHistory();
    }

    @Override
    public Map<Integer, Double> getYearlySales(int year) {
        List<Object[]> results = bookingRepository.getMonthlySales(year);

        // Sắp xếp kết quả trước khi chuyển sang Map
        results.sort((a, b) -> Integer.compare((Integer) a[0], (Integer) b[0]));

        Map<Integer, Double> monthlySales = new LinkedHashMap<>();

        for (Object[] result : results) {
            Integer month = (Integer) result[0];
            Double totalSales = (Double) result[1];
            monthlySales.put(month, totalSales);
        }

        return monthlySales;
    }

    @Override
    public Map<String, Double> getTopMoviesBySales(int month, int year) {
        List<Object[]> results = bookingRepository.getTopMoviesBySales(month, year);

        Map<String, Double> movieSales = new LinkedHashMap<>();
        for (Object[] result : results) {
            String movieTitle = (String) result[0];
            Double totalSales = (Double) result[1];
            movieSales.put(movieTitle, totalSales);
        }
        return movieSales;
    }

    @Override
    public Map<Integer, Long> getTicketsByBookingMonth() {
        List<Object[]> results = bookingRepository.countByBookingMonth();
        Map<Integer, Long> ticketsByMonth = new HashMap<>();
        for (Object[] result : results) {
            ticketsByMonth.put((Integer) result[0], (Long) result[1]);
        }
        return ticketsByMonth;
    }

    @Override
    public Map<String, Long> getTicketsByMovie() {
        List<Object[]> results = bookingRepository.countByMovie();
        Map<String, Long> ticketsByMovie = new HashMap<>();
        for (Object[] result : results) {
            String movieName = (String) result[0];
            Long ticketCount = (Long) result[1];
            ticketsByMovie.put(movieName, ticketCount);
        }
        return ticketsByMovie;
    }
}
