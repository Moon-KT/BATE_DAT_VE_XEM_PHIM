package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.CinemaDto;
import org.example.final_btl_datve.dto.LocationDto;
import org.example.final_btl_datve.entity.Cinema;
import org.example.final_btl_datve.entity.Location;
import org.example.final_btl_datve.repository.CinemaRepository;
import org.example.final_btl_datve.repository.LocationRepository;
import org.example.final_btl_datve.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    
    private final CinemaRepository cinemaRepository;
    
    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository, CinemaRepository cinemaRepository) {
        this.locationRepository = locationRepository;
        this.cinemaRepository = cinemaRepository;
    }

    private LocationDto convertToDto(Location location) {
        return LocationDto.builder()
                .locationId(location.getLocationId())
                .city(location.getCity())
                .build();
    }

    private CinemaDto convertToDto(Cinema cinema) {
        return CinemaDto.builder()
                .cinemaName(cinema.getCinemaName())
                .cinemaId(cinema.getCinemaId())
                .hotline(cinema.getHotline())
                .detailedAddress(cinema.getDetailedAddress())
                .locationId(cinema.getLocation().getLocationId())
                .build();
    }
    
    @Override
    public LocationDto create(LocationDto locationDto) throws Exception {
        Location location = Location.builder()
                .city(locationDto.getCity())
                .build();
        return convertToDto(locationRepository.save(location));
    }

    @Override
    public List<LocationDto> reads() {
        return locationRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public LocationDto read(Long locationId) throws Exception {
        return locationRepository.findById(locationId)
                .map(this::convertToDto)
                .orElseThrow(() -> { return new Exception("Không tìm thấy địa điểm có ID: " + locationId);
                });
    }

    @Override
    public LocationDto update(Long locationId, LocationDto locationDto) throws Exception {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> { return new Exception("Không tìm thấy địa điểm có ID: " + locationId);
                });
        location.toBuilder()
                .city(locationDto.getCity())
                .build();
        return convertToDto(locationRepository.save(location));
    }

    @Override
    public void delete(Long locationId) throws Exception {
        if(!locationRepository.existsById(locationId)) {
            throw new Exception("Không tìm thấy địa điểm có ID: " + locationId);
        }
    }

    @Override
    public List<CinemaDto> getCinemaByLocation(Long locationId) throws Exception {
        return cinemaRepository.findAll().stream()
                .filter(cinema -> cinema.getLocation().getLocationId().equals(locationId))
                .map(this::convertToDto)
                .toList();
    }
}

