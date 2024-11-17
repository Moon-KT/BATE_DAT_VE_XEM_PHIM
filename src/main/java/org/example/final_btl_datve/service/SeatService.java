package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.SeatDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface SeatService {
    //CRUD
    SeatDto create(SeatDto seatDto) throws Exception;
    List<SeatDto> reads();
    SeatDto read(Long seatId) throws Exception;
    SeatDto update(Long seatId, SeatDto seatDto) throws Exception;
    void delete(Long seatId) throws Exception;
}
