package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.MovieComboRequest;
import org.example.final_btl_datve.dto.MovieDto;
import org.example.final_btl_datve.dto.MovieViewData;
import org.example.final_btl_datve.dto.PromotionDto;
import org.example.final_btl_datve.entity.Booking;
import org.example.final_btl_datve.entity.Combo;
import org.example.final_btl_datve.entity.Movie;
import org.example.final_btl_datve.entity.Promotion;
import org.example.final_btl_datve.repository.BookingRepository;
import org.example.final_btl_datve.repository.ComboRepository;
import org.example.final_btl_datve.repository.MovieRepository;
import org.example.final_btl_datve.repository.PromotionRepository;
import org.example.final_btl_datve.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final BookingRepository bookingRepository;
    private final PromotionRepository promotionRepository;
    private final ComboRepository comboRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository, BookingRepository bookingRepository, PromotionRepository promotionRepository, ComboRepository comboRepository) {
        this.movieRepository = movieRepository;
        this.bookingRepository = bookingRepository;
        this.promotionRepository = promotionRepository;
        this.comboRepository = comboRepository;
    }

    private MovieDto convertToDto(Movie movie){
        return MovieDto.builder()
                .movieId(movie.getMovieId())
                .movieName(movie.getMovieName())
                .movieDescription(movie.getMovieDescription())
                .movieActor(movie.getMovieActor())
                .movieDirector(movie.getMovieDirector())
                .movieDuration(movie.getMovieDuration())
                .movieLanguage(movie.getMovieLanguage())
                .moviePoster(movie.getMoviePoster())
                .movieTrailer(movie.getMovieTrailer())
                .movieReleaseDate(movie.getMovieReleaseDate())
                .movieRated(movie.getMovieRated())
                .movie_genreList(movie.getMovie_genreList())
                .movieId(movie.getMovieId())
                .showtimeList(movie.getShowtimeList())
                .movieViews(bookingRepository.findAll().stream()
                        .filter(booking -> booking.getShowtime().getMovie().getMovieId().equals(movie.getMovieId()))
                        .mapToLong(booking -> booking.getBooking_seats().size())
                        .sum())
                .build();
    }

    @Override
    public MovieDto create(MovieDto movieDto) throws Exception{
        Movie movie = Movie.builder()
                .movieName(movieDto.getMovieName())
                .movieDescription(movieDto.getMovieDescription())
                .movieActor(movieDto.getMovieActor())
                .movieDirector(movieDto.getMovieDirector())
                .movieDuration(movieDto.getMovieDuration())
                .movieLanguage(movieDto.getMovieLanguage())
                .moviePoster(movieDto.getMoviePoster())
                .movieTrailer(movieDto.getMovieTrailer())
                .movieReleaseDate(movieDto.getMovieReleaseDate())
                .movieRated(movieDto.getMovieRated())
                .build();
        return convertToDto(movieRepository.save(movie));
    }

    @Override
    public List<MovieDto> reads() {
        List<Movie> movies = movieRepository.findAll();
        List<MovieDto> movieDtos = movies.stream().map(this::convertToDto).collect(Collectors.toList());

        List<Booking> bookings = bookingRepository.findAll();
        // Calculate views for each movie
        for (MovieDto movieDto : movieDtos) {
            Long views = bookings.stream()
                    .filter(booking -> booking.getShowtime().getMovie().getMovieId().equals(movieDto.getMovieId()))
                    .mapToLong(booking -> booking.getBooking_seats().size())
                    .sum();
            movieDto.setMovieViews(views);
        }

        return movieDtos;
    }

    @Override
    public MovieDto read(Long movieID) throws Exception {
        return movieRepository.findById(movieID)
                .map(this::convertToDto)
                .orElseThrow(() -> new Exception("Not found movie with ID: " + movieID));
    }

    @Override
    public MovieDto update(Long movieID, MovieDto movieDto) throws Exception {
        Movie existingMovie = movieRepository.findById(movieID)
                .orElseThrow(() -> new Exception("Not found movie with ID: " + movieID));
        Movie updatedMovie = existingMovie.toBuilder()
                .movieName(movieDto.getMovieName())
                .movieDescription(movieDto.getMovieDescription())
                .movieActor(movieDto.getMovieActor())
                .movieDirector(movieDto.getMovieDirector())
                .movieDuration(movieDto.getMovieDuration())
                .movieLanguage(movieDto.getMovieLanguage())
                .moviePoster(movieDto.getMoviePoster())
                .movieTrailer(movieDto.getMovieTrailer())
                .movieReleaseDate(movieDto.getMovieReleaseDate())
                .build();
        return convertToDto(movieRepository.save(updatedMovie));
    }

    @Override
    public void delete(Long movieID) {
        if (!movieRepository.existsById(movieID)) {
            throw new RuntimeException("Not found movie with ID: " + movieID);
        }
        movieRepository.deleteById(movieID);
    }

    @Override
    public List<MovieDto> search(String keyword) {
        return movieRepository.searchByKeyword(keyword).stream().map(this::convertToDto).toList();
    }

//    @Override
//    public List<MovieComboRequest> getMovies(String keyword) {
//        List<Movie> movies = movieRepository.findAll();
//        if (keyword != null && !keyword.isEmpty()) {
//            movies = movieRepository.searchByKeyword(keyword);
//        }
//        return movies.stream().map(this::convertToViewData).toList();
//    }
//
//    private MovieComboRequest convertToViewData(Movie movie){
//        List<String> conbo = new ArrayList<>();
//        List<Promotion> promotion = promotionRepository.findPromotionsByKeyword(movie.getMovieName()).stream().toList();
//        for(Promotion p : promotion){
//            if( p.getPromotionType().equals("COMBO"))
//            {
//                List<Combo> combo = comboRepository.findAll();
//                for(Combo c : combo){
//                    if(c.getComboName().equals(p.getPromotionName())){
//                        conbo.add(c.getComboName());
//                    }
//                }
//            }
//        }
//
//        return MovieComboRequest.builder()
//                .name(movie.getMovieName())
//                .poster(movie.getMoviePoster())
//                .genres(movie.getMovie_genreList().stream().map(genre -> genre.getGenre() + ",").toList())
//                .views(bookingRepository.findAll().stream()
//                        .filter(booking -> booking.getShowtime().getMovie().getMovieId().equals(movie.getMovieId()))
//                        .mapToLong(booking -> booking.getBooking_seats().size())
//                        .sum())
//                .totalPrice(bookingRepository.findAll().stream()
//                        .filter(booking -> booking.getShowtime().getMovie().getMovieId().equals(movie.getMovieId()))
//                        .mapToDouble(booking -> booking.getTotalPrice())
//                        .sum())
//                .combo(conbo)
//                .build();
//    }

    @Override
    public List<MovieDto> getNewMovies() {
        return movieRepository.findNewMovies().stream().map(this::convertToDto).toList();
    }

    @Override
    public List<MovieDto> getUpcomingMovies() {
        return movieRepository.findUpcomingMovies().stream().map(this::convertToDto).toList();
    }

    @Override
    public List<MovieDto> getMostViewedMovies() {
        return movieRepository.findMostViewedMovies().stream().map(this::convertToDto).toList();
    }
}
