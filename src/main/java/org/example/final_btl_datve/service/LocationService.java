package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.CinemaDto;
import org.example.final_btl_datve.dto.LocationDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface LocationService {
    //CRUD
    LocationDto create(LocationDto locationDto) throws Exception;
    List<LocationDto> reads();
    LocationDto read(Long locationId) throws Exception;
    LocationDto update(Long locationId, LocationDto locationDto) throws Exception;
    void delete(Long locationId) throws Exception;
}
