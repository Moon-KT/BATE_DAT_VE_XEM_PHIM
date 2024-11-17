package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.SeatDto;
import org.example.final_btl_datve.dto.ShowtimeDto;
import org.example.final_btl_datve.entity.Movie;
import org.example.final_btl_datve.entity.ScreeningRoom;
import org.example.final_btl_datve.entity.Showtime;
import org.example.final_btl_datve.entity.enumModel.SeatStatus;
import org.example.final_btl_datve.repository.MovieRepository;
import org.example.final_btl_datve.repository.ScreeningRoomRepository;
import org.example.final_btl_datve.repository.ShowtimeRepository;
import org.example.final_btl_datve.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {
    private final ShowtimeRepository showtimeRepository;
    private final ScreeningRoomRepository screeningRoomRepository;
    private final MovieRepository movieRepository;

    @Autowired
    public ShowtimeServiceImpl(ShowtimeRepository showtimeRepository, ScreeningRoomRepository screeningRoomRepository, MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.screeningRoomRepository = screeningRoomRepository;
        this.movieRepository = movieRepository;
    }
    private ShowtimeDto convertToDto(Showtime showtime) {
        return ShowtimeDto.builder()
                .showtimeId(showtime.getShowtimeId())
                .startTime(showtime.getStartTime())
                .movieId(showtime.getMovie().getMovieId())
                .roomId(showtime.getRoom().getRoomId())
                .build();
    }

    @Override
    public List<ShowtimeDto> reads() {
        return showtimeRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public ShowtimeDto read(Long showtimeID) throws Exception {
        return showtimeRepository.findById(showtimeID)
                .map(this::convertToDto)
                .orElseThrow(() -> new Exception("Không tìm thấy suất chiếu có ID: " + showtimeID));
    }

    @Override
    public ShowtimeDto create(ShowtimeDto showtimeDto) throws Exception {
        Movie movie = movieRepository.findById(showtimeDto.getMovieId())
                .orElseThrow(() -> new Exception("Không tìm thấy phim có ID: " + showtimeDto.getMovieId()));
        ScreeningRoom screeningRoom = screeningRoomRepository.findById(showtimeDto.getRoomId())
                .orElseThrow(() -> new Exception("Không tìm thấy phòng chiếu có ID: " + showtimeDto.getRoomId()));

        return convertToDto(showtimeRepository.save(Showtime.builder()
                .startTime(showtimeDto.getStartTime())
                .movie(movie)
                .room(screeningRoom)
                .build()));
    }

    @Override
    public ShowtimeDto update(Long showtimeID, ShowtimeDto showtimeDto) throws Exception {
        Movie movie = movieRepository.findById(showtimeDto.getMovieId())
                .orElseThrow(() -> new Exception("Không tìm thấy phim có ID: " + showtimeDto.getMovieId()));
        ScreeningRoom screeningRoom = screeningRoomRepository.findById(showtimeDto.getRoomId())
                .orElseThrow(() -> new Exception("Không tìm thấy phòng chiếu có ID: " + showtimeDto.getRoomId()));
        Showtime showtime = showtimeRepository.findById(showtimeID).orElseThrow(() -> new Exception("Không tìm thấy suất chiếu có ID: " + showtimeID));

        return convertToDto(showtimeRepository.save(showtime.toBuilder()
                .startTime(showtimeDto.getStartTime())
                .movie(movie)
                .room(screeningRoom)
                .build()));
    }

    @Override
    public void delete(Long showtimeID) throws Exception {
        if(!showtimeRepository.existsById(showtimeID)) {
            throw new Exception("Không tìm thấy suất chiếu có ID: " + showtimeID);
        }
        showtimeRepository.deleteById(showtimeID);
    }

    @Override
    public List<Object[]> getShowtimeByMovieName(String movieName) {
        return showtimeRepository.getShowtimeByMovieName(movieName);
    }

//    @Override
//    public List<SeatDto> getEmptySeatByShowtimeId(Long showtimeId) {
//        return showtimeRepository.findById(showtimeId)
//                .map(showtime -> showtime.getRoom().getSeatList().stream()
//                        .filter(seat -> seat.getStatus() == SeatStatus.Available) // Filter empty seats
//                        .map(seat -> SeatDto.builder()
//                                .seatId(seat.getSeatId())
//                                .seatNumber(seat.getSeatNumber())
//                                .seatRow(seat.getSeatRow())
//                                .status(seat.getStatus())
//                                .build())
//                        .collect(Collectors.toList()))
//                .orElseGet(Collections::emptyList); // Return an empty list if showtime is not found
//    }

    @Override
    public List<ShowtimeDto> search(String keyword) throws Exception {
        return showtimeRepository.findAll().stream()
                .filter(showtime -> showtime.getMovie().getMovieName().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

}
