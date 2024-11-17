package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.SeatTypeDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SeatTypeService {
    //CRUD
    SeatTypeDto create(SeatTypeDto seatTypeDto) throws Exception;
    List<SeatTypeDto> reads();
    SeatTypeDto read(Long seatTypeId) throws Exception;
    SeatTypeDto update(Long seatTypeId, SeatTypeDto seatTypeDto) throws Exception;
    void delete(Long seatTypeId) throws Exception;
}
