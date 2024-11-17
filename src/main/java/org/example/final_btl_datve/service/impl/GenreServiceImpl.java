package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.GenreDto;
import org.example.final_btl_datve.dto.MovieDto;
import org.example.final_btl_datve.entity.Genre;
import org.example.final_btl_datve.entity.Movie;
import org.example.final_btl_datve.repository.GenreRepository;
import org.example.final_btl_datve.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GenreServiceImpl implements GenreService {
    private final GenreRepository genreRepository;

    @Autowired
    public GenreServiceImpl(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    private GenreDto convertToDto(Genre genre) {
        return GenreDto.builder()
                .genreId(genre.getGenreId())
                .genreName(genre.getGenreName())
                .build();
    }

    @Override
    public GenreDto create(GenreDto genreDto) throws Exception {
        Genre genre = Genre.builder()
                .genreName(genreDto.getGenreName())
                .build();
        genreRepository.save(genre);
        return convertToDto(genre);
    }

    @Override
    public List<GenreDto> reads() {
        return genreRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public GenreDto read(Long genreID) throws Exception {
        return genreRepository.findById(genreID)
                .map(this::convertToDto)
                .orElseThrow(() -> {
                    return new Exception("Không tìm thấy thể loại có ID: " + genreID);
                });
    }

    @Override
    public GenreDto update(Long genreID, GenreDto genreDto) throws Exception {
        Genre genre = genreRepository.findById(genreID)
                .orElseThrow(() -> { return new Exception("Không tìm thấy thể loại có ID: " + genreID);
                });
        genre.setGenreName(genreDto.getGenreName());
        genreRepository.save(genre);
        return convertToDto(genre);
    }

    @Override
    public void delete(Long genreID) throws Exception {
        if (!genreRepository.existsById(genreID)) {
            throw new Exception("Không tìm thấy thể loại có ID: " + genreID);
        }
        genreRepository.deleteById(genreID);
    }

    @Override
    public List<MovieDto> getMoviesByGenre(Long genreID) throws Exception {
        Genre genre = genreRepository.findById(genreID)
                .orElseThrow(() -> new Exception("Không tìm thấy thể loại có ID: " + genreID));
        return genre.getMovie_genreList().stream()
                .map(movieGenre -> convertMovieToDto(movieGenre.getMovie()))
                .collect(Collectors.toList());
    }

    private MovieDto convertMovieToDto(Movie movie) {
        return MovieDto.builder()
                .movieId(movie.getMovieId())
                .movieName(movie.getMovieName())
                .movieReleaseDate(movie.getMovieReleaseDate())
                .build();
    }
}

