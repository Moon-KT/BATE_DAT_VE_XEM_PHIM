package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username LIKE %?1% OR u.email LIKE %?1%")
    List<User> search(String keyword);

    @Query("SELECT u.username, m.movieName, b.bookingTime, " +
            "GROUP_CONCAT(CONCAT( bs.seat.seatRow, '-', bs.seat.seatNumber)) AS seatNames," +
            "c.cinemaName," +
            "COUNT(bs.seat)" +
            "FROM User u " +
            "JOIN u.bookings b " +
            "JOIN b.showtime s " +
            "JOIN s.movie m " +
            "JOIN b.booking_seats bs " +
            "JOIN bs.seat.room.cinema c " +
            "WHERE b.bookingTime = (SELECT MAX(b2.bookingTime) FROM Booking b2 WHERE b2.user = u) " +
            "GROUP BY u.username, m.movieName, b.bookingTime, c.cinemaName " +
            "ORDER BY b.bookingTime DESC")
    List<Object[]> getCustomerBookingHistory();

    @Query("SELECT m.movieName, b.bookingTime, bc.combo, COUNT(bs.seat)" +
            "FROM User u " +
            "JOIN u.bookings b " +
            "JOIN b.showtime s " +
            "JOIN s.movie m " +
            "JOIN b.booking_seats bs " +
            "JOIN b.booking_combos bc " +
            "WHERE b.bookingTime = (SELECT MAX(b2.bookingTime) FROM Booking b2 WHERE b2.user = u) " +
            "GROUP BY u.username, m.movieName, b.bookingTime " +
            "ORDER BY b.bookingTime DESC")
    List<Object> getBookingHistory(Long userID);
}
