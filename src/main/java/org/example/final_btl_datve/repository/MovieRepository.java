package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.dto.MovieDto;
import org.example.final_btl_datve.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("SELECT m FROM Movie m " +
            "JOIN m.movie_genreList mv " +
            "WHERE m.movieName LIKE %:keyword% OR mv.genre.genreName LIKE %:keyword%")
    List<Movie> searchByKeyword( String keyword);


    @Query(value = "SELECT * FROM movies m WHERE m.movie_release_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)", nativeQuery = true)
    List<Movie> findNewMovies();

    @Query(value = "SELECT * FROM movies m WHERE m.movie_release_date > CURRENT_DATE", nativeQuery = true)
    List<Movie> findUpcomingMovies();

    @Query("SELECT m FROM Movie m " +
            "JOIN m.showtimeList s " +
            "JOIN s.bookings b " +
            "JOIN b.booking_seats bs " +
            "WHERE bs.id IS NOT NULL " + // Lọc chỉ những phim có ghế đã được đặt
            "GROUP BY m " +
            "ORDER BY COUNT(bs.id) DESC")
    List<Movie> findMostViewedMovies();

}
