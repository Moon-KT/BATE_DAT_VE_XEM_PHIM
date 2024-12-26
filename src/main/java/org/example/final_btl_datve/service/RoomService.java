package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.RoomDto;
import org.example.final_btl_datve.dto.SeatDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoomService {
    RoomDto create(RoomDto RoomDto) throws Exception;
    List<RoomDto> reads();
    RoomDto read(Long screeningRoomID) throws Exception;
    RoomDto update(Long screeningRoomID, RoomDto RoomDto) throws Exception;
    void delete(Long screeningRoomID) throws Exception;

    SeatDto readSeat(Long screeningRoomID, String seatRow, int seatNumber) throws Exception;
}
