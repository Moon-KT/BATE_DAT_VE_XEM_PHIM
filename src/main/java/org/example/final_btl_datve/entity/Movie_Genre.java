package org.example.final_btl_datve.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.key.MovieGenreKey;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode
@Table(name = "movie_genre", uniqueConstraints = {@UniqueConstraint(columnNames = {"movie_id", "genre_id"})})
public class Movie_Genre {
    @EmbeddedId
    private MovieGenreKey id;

    @ManyToOne
    @MapsId("movieId")
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @ManyToOne
    @MapsId("genreId")
    @JoinColumn(name = "genre_id", insertable = false, updatable = false)
    private Genre genre;

}