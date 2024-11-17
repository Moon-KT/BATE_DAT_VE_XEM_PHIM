package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.SeatTypeDto;
import org.example.final_btl_datve.entity.SeatType;
import org.example.final_btl_datve.repository.SeatTypeRepository;
import org.example.final_btl_datve.service.SeatTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatTypeServiceImpl implements SeatTypeService {
    private final SeatTypeRepository seatTypeRepository;

    public SeatTypeServiceImpl(SeatTypeRepository seatTypeRepository) {
        this.seatTypeRepository = seatTypeRepository;
    }

    private SeatTypeDto convertToDto(SeatType seatType) {
        return SeatTypeDto.builder()
                .seatTypeId(seatType.getSeatTypeId())
                .seatTypeName(seatType.getSeatTypeName())
                .seatPrice(seatType.getSeatPrice())
                .build();
    }
    @Override
    public SeatTypeDto create(SeatTypeDto seatTypeDto) throws Exception {
        SeatType seatType = SeatType.builder()
                .seatTypeName(seatTypeDto.getSeatTypeName())
                .seatPrice(seatTypeDto.getSeatPrice())
                .build();
        return convertToDto(seatTypeRepository.save(seatType));
    }

    @Override
    public List<SeatTypeDto> reads(){
        return seatTypeRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public SeatTypeDto read(Long seatTypeId) throws Exception {
        return seatTypeRepository.findById(seatTypeId)
                .map(this::convertToDto)
                .orElseThrow(() -> new Exception("Không tìm thấy loại ghế có ID: " + seatTypeId));
    }

    @Override
    public SeatTypeDto update(Long seatTypeId, SeatTypeDto seatTypeDto) throws Exception {
        SeatType seatType = seatTypeRepository.findById(seatTypeId)
                .orElseThrow(() -> new Exception("Không tìm thấy loại ghế có ID: " + seatTypeId));
        seatType.toBuilder()
                .seatTypeName(seatTypeDto.getSeatTypeName())
                .seatPrice(seatTypeDto.getSeatPrice())
                .build();
        return convertToDto(seatTypeRepository.save(seatType));
    }

    @Override
    public void delete(Long seatTypeId) throws Exception {
        if(!seatTypeRepository.existsById(seatTypeId)){
            throw new Exception("Không tìm thấy loại ghế có ID: " + seatTypeId);
        }
        seatTypeRepository.deleteById(seatTypeId);
    }
}
