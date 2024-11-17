package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.SeatDto;
import org.example.final_btl_datve.dto.ShowtimeDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ShowtimeService {
    //CRUD
    ShowtimeDto create(ShowtimeDto showtimeDto) throws Exception;
    ShowtimeDto read(Long showtimeID) throws Exception;
    List<ShowtimeDto> reads();
    ShowtimeDto update(Long showtimeID, ShowtimeDto showtimeDto) throws Exception;
    void delete(Long showtimeID) throws Exception;

    //Other
    List<Object[]> getShowtimeByMovieName(String movieName);
    List<ShowtimeDto> search(String keyword) throws Exception;
}
