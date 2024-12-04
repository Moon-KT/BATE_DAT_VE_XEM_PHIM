package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.*;
import org.example.final_btl_datve.entity.Cinema;
import org.example.final_btl_datve.entity.Location;
import org.example.final_btl_datve.repository.CinemaRepository;
import org.example.final_btl_datve.repository.LocationRepository;
import org.example.final_btl_datve.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class CinemaServiceImpl implements CinemaService {
    private final CinemaRepository cinemaRepository;
    private final LocationRepository locationRepository;

    @Autowired
    public CinemaServiceImpl(CinemaRepository cinemaRepository, LocationRepository locationRepository) {
        this.cinemaRepository = cinemaRepository;
        this.locationRepository = locationRepository;
    }

    private CinemaDto convertToDto(Cinema cinema) {
        return CinemaDto.builder()
                .cinemaId(cinema.getCinemaId())
                .cinemaName(cinema.getCinemaName())
                .detailedAddress(cinema.getDetailedAddress())
                .hotline(cinema.getHotline())
                .locationId(cinema.getLocation().getLocationId())
                .build();
    }

    @Override
    public CinemaDto create(CinemaDto cinemaDto) throws Exception {
        Cinema cinema = Cinema.builder()
                .cinemaName(cinemaDto.getCinemaName())
                .detailedAddress(cinemaDto.getDetailedAddress())
                .hotline(cinemaDto.getHotline())
                .location(locationRepository.findById(cinemaDto.getLocationId())
                        .orElseThrow(() -> {
                            return new Exception("Không tìm thấy địa điểm có ID: " + cinemaDto.getLocationId());
                        }))
                .build();
        return convertToDto(cinemaRepository.save(cinema));
    }

    @Override
    public List<CinemaDto> findByCinemaName(String cinemaName) {
        return cinemaRepository.findByCinemaNameContaining(cinemaName).stream().map(this::convertToDto).toList();
    }

    @Override
    public List<CinemaDto> reads() {
        return cinemaRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public CinemaDto read(Long cinemaID) throws Exception {
        return cinemaRepository.findById(cinemaID)
                .map(this::convertToDto)
                .orElseThrow(() -> {
                    return new Exception("Không tìm thấy rạp có ID: " + cinemaID);
                });
    }

    @Override
    public CinemaDto update(Long cinemaID, CinemaDto cinemaDto) throws Exception {
        Cinema cinema = cinemaRepository.findById(cinemaID)
                .orElseThrow(() -> new Exception("Không tìm thấy rạp có ID: " + cinemaID));

        Location location = locationRepository.findById(cinemaDto.getLocationId())
                .orElseThrow(() -> new Exception("Không tìm thấy địa điểm có ID: " + cinemaDto.getLocationId()));

        cinema.setCinemaName(cinemaDto.getCinemaName());
        cinema.setDetailedAddress(cinemaDto.getDetailedAddress());
        cinema.setHotline(cinemaDto.getHotline());
        cinema.setLocation(location);

        Cinema saved = cinemaRepository.save(cinema);
        return convertToDto(saved);
    }

    @Override
    public void delete(Long cinemaID) throws Exception {
        if (!cinemaRepository.existsById(cinemaID)) {
            throw new Exception("Không tìm thấy rạp có ID: " + cinemaID);
        }
        cinemaRepository.deleteById(cinemaID);
    }

    @Override
    public List<ScreeningRoomDto> getRoomByCinema(Long cinemaID) {
        return cinemaRepository.findById(cinemaID)
                .map(cinema -> cinema.getScreeningRoomList().stream().map(room -> {
                    ScreeningRoomDto roomDto = new ScreeningRoomDto();
                    roomDto.setRoomName(room.getRoomName());
                    return roomDto;
                }).toList())
                .orElseGet(Collections::emptyList);
    }

    @Override
    public List<MovieDto> getMovieByCinema(Long cinemaID) {
        return cinemaRepository.findById(cinemaID)
                .map(cinema -> cinema.getScreeningRoomList().stream()
                        .flatMap(screeningRoom -> screeningRoom.getShowtimeList().stream()) // Lấy danh sách showtime từ mỗi phòng chiếu
                        .map(showtime -> showtime.getMovie()) // Lấy phim từ showtime
                        .distinct() // Để loại bỏ phim trùng lặp
                        .map(movie -> {
                            MovieDto movieDto = MovieDto.builder()
                                    .movieId(movie.getMovieId())
                                    .movieName(movie.getMovieName())
                                    .movieDuration(movie.getMovieDuration())
                                    .movieDescription(movie.getMovieDescription())
                                    .moviePoster(movie.getMoviePoster())
                                    .movieTrailer(movie.getMovieTrailer())
                                    .movieReleaseDate(movie.getMovieReleaseDate())
                                    .movieRated(movie.getMovieRated())
                                    .movieActor(movie.getMovieActor())
                                    .movieDirector(movie.getMovieDirector())
                                    .movieLanguage(movie.getMovieLanguage())
                                    .genreList(movie.getMovie_genreList().stream()
                                            .map(movieGenre -> new GenreDto(movieGenre.getGenre().getGenreId(), movieGenre.getGenre().getGenreName()))
                                            .toList())
                                    .showtimeList(movie.getShowtimeList().stream()
                                            .filter(showtime -> !showtime.getStartTime().isBefore(java.time.LocalDateTime.now()))
                                            .map(showtime ->{
                                                    Integer totalSeats = showtime.getRoom().getSeatList().size();
                                                    Long bookedSeats = showtime.getBookings().stream()
                                                            .flatMap(booking -> booking.getBooking_seats().stream())
                                                            .count();
                                                    Long emptySeats = totalSeats - bookedSeats;
                                                    return new ShowtimeDto(showtime.getShowtimeId(), showtime.getStartTime(), showtime.getRoom().getRoomId(), showtime.getMovie().getMovieId(),emptySeats );})
                                            .toList())
                                    .build();
                            return movieDto;
                        }).toList())
                .orElseGet(Collections::emptyList);
    }
}
