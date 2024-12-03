package org.example.final_btl_datve.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.Genre;
import org.example.final_btl_datve.entity.Movie_Genre;
import org.example.final_btl_datve.entity.Showtime;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDto {
    private Long movieId;
    private String movieName;
    private String movieDescription;
    private String movieDirector;
    private String movieActor;
    private Integer movieDuration;
    private LocalDate movieReleaseDate;
    private String moviePoster;
    private String movieTrailer;
    private String movieLanguage;
    private Long movieViews;
    private Integer movieRated;

    private List<ShowtimeDto> showtimeList;
    private List<GenreDto> genreList;
}
