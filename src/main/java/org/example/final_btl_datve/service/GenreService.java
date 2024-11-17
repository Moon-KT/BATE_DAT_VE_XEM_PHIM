package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.GenreDto;
import org.example.final_btl_datve.dto.MovieDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GenreService {
    //CRUD
    GenreDto create(GenreDto genreDto) throws Exception;
    List<GenreDto> reads();
    GenreDto read(Long genreID) throws Exception;
    GenreDto update(Long genreID, GenreDto genreDto) throws Exception;
    void delete(Long genreID) throws Exception;

    //Other
    List<MovieDto> getMoviesByGenre(Long genreID) throws Exception;
}
