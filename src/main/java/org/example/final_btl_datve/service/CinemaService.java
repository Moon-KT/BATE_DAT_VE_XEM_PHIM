package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.CinemaDto;
import org.example.final_btl_datve.dto.MovieDto;
import org.example.final_btl_datve.dto.ScreeningRoomDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CinemaService {
    //CRUD
    CinemaDto create(CinemaDto cinemaDto) throws Exception;
    List<CinemaDto> reads();

    CinemaDto read(Long cinemaID) throws Exception;

    CinemaDto update(Long cinemaID, CinemaDto cinemaDto) throws Exception;

    void delete(Long cinemaID) throws Exception;

    //Other
    List<CinemaDto> findByCinemaName(String cinemaName);
    List<ScreeningRoomDto> getRoomByCinema(Long cinemaID);
    List<MovieDto> getMovieByCinema(Long cinemaID);
}
