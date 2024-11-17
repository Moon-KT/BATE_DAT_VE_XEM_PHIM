package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "movie_id")
    private Long movieId;

    @Nationalized
    @Column(name = "movie_name")
    private String movieName;

    @Nationalized
    @Column(name = "movie_description", length = 1000)
    private String movieDescription;

    @Nationalized
    @Column(name = "movie_director")
    private String movieDirector;

    @Nationalized
    @Column(name = "movie_actor")
    private String movieActor;

    @Column(name = "movie_duration")
    private Integer movieDuration;

    @Column(name = "movie_release_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate movieReleaseDate;

    @Column(name = "movie_poster")
    private String moviePoster;

    @Column(name = "movie_trailer")
    private String movieTrailer;

    @Nationalized
    @Column(name = "movie_language")
    private String movieLanguage;

    @Column(name = "movie_rated")
    private Integer movieRated;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Showtime> showtimeList;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Movie_Genre> movie_genreList;
}
