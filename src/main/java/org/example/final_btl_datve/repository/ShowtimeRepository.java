package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    @Query("SELECT r.cinema.cinemaName AS cinemaName, s.startTime, r.roomName, COUNT(st.seat) AS availableSeats " +
            "FROM Showtime s " +
            "JOIN s.room r " +
            "JOIN r.seatList sl " +
            "JOIN sl.bookingSeats st " +
            "WHERE st.status = 'Available' AND s.movie.movieName LIKE %:movieName% " +
            "GROUP BY r.cinema.cinemaName, s.startTime, r.roomName")
    List<Object[]> getShowtimeByMovieName(@Param("movieName") String movieName);

    @Query("SELECT s FROM Showtime s WHERE s.movie.movieId = :movieId")
    List<Showtime> getShowtimeByMovieId(@Param("movieId") Long movieId);

}
