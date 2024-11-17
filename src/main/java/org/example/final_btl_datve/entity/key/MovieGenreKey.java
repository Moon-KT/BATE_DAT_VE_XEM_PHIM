package org.example.final_btl_datve.entity.key;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@Embeddable
@EqualsAndHashCode
public class MovieGenreKey {
    private Long movieId;
    private Long genreId;
}
