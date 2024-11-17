package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Truy vấn để tính tổng giá theo tháng
    @Query("SELECT MONTH(b.bookingTime) AS month, SUM(b.totalPrice) AS totalSales " +
            "FROM Booking b " +
            "WHERE YEAR(b.bookingTime) = :year " +
            "GROUP BY MONTH(b.bookingTime) ")
    List<Object[]> getMonthlySales(int year);

    @Query("SELECT m.movieName AS movieTitle, SUM(b.totalPrice) AS totalSales " +
            "FROM Booking b " +
            "JOIN b.showtime s " +
            "JOIN s.movie m " +
            "WHERE MONTH(b.bookingTime) = :month AND YEAR(b.bookingTime) = :year " +
            "GROUP BY m.movieName " +
            "ORDER BY totalSales DESC")
    List<Object[]> getTopMoviesBySales(@Param("month") int month, @Param("year") int year);

    // Thống kê tổng số vé đặt theo tháng
    @Query("SELECT MONTH(b.bookingTime), COUNT(b.bookingId) " +
            "FROM Booking b " +
            "GROUP BY MONTH(b.bookingTime)")
    List<Object[]> countByBookingMonth();

    // Thống kê số vé đặt theo từng phim
    @Query("SELECT m.movieName, COUNT(b.bookingId) " +
            "FROM Booking b " +
            "JOIN b.showtime s " +
            "JOIN s.movie m " +
            "GROUP BY m.movieName ")
    List<Object[]> countByMovie();
}
