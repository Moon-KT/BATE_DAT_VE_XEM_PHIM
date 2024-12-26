package org.example.final_btl_datve.repository;

import jakarta.persistence.Tuple;
import org.example.final_btl_datve.dto.BookingHistoryDto;
import org.example.final_btl_datve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

@Query(value = "SELECT m.movie_name AS movieName, " +
        "b.booking_time AS bookingTime, " +
        "b.points_earned AS point, " +
        "(SELECT GROUP_CONCAT(CONCAT(temp.combo_id, ' (', temp.combo_count, ')')) " +
        " FROM (SELECT bc.combo_id, COUNT(*) AS combo_count " +
        "       FROM booking_combo bc " +
        "       WHERE bc.booking_id = b.booking_id " +
        "       GROUP BY bc.combo_id) AS temp) AS comboDetails, " +
        "COUNT(bs.seat_id) AS seatCount, " +
        "c.cinema_name AS cinemaName, " +
        "sr.room_name AS roomName, " +
        "GROUP_CONCAT(CONCAT(se.seat_row, se.seat_number) ORDER BY se.seat_row, se.seat_number ASC) AS seatNames " +
        "FROM users u " +
        "JOIN booking b ON u.user_id = b.user_id " +
        "JOIN showtimes s ON b.showtime_id = s.showtime_id " +
        "JOIN movies m ON s.movie_id = m.movie_id " +
        "JOIN booking_seat bs ON b.booking_id = bs.booking_id " +
        "JOIN seats se ON bs.seat_id = se.seat_id " +
        "JOIN screening_rooms sr ON s.room_id = sr.room_id " +
        "JOIN cinemas c ON sr.cinema_id = c.cinema_id " +
        "WHERE u.user_id = :userID " +
        "AND b.booking_time = (SELECT MAX(b2.booking_time) FROM booking b2 WHERE b2.user_id = u.user_id) " +
        "GROUP BY m.movie_name, b.booking_time, b.booking_id " +
        "ORDER BY b.booking_time DESC",
        nativeQuery = true)
List<Tuple> getBookingHistory(@Param("userID") Long userID);

}
