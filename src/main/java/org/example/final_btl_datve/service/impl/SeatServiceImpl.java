package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.SeatDto;
import org.example.final_btl_datve.entity.Seat;
import org.example.final_btl_datve.repository.SeatRepository;
import org.example.final_btl_datve.repository.SeatTypeRepository;
import org.example.final_btl_datve.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;

    private final SeatTypeRepository seatTypeRepository;

    public SeatServiceImpl(SeatRepository seatRepository, SeatTypeRepository seatTypeRepository) {
        this.seatRepository = seatRepository;
        this.seatTypeRepository = seatTypeRepository;
    }

    private SeatDto convertToDto(Seat seat) {
        return SeatDto.builder()
                .seatId(seat.getSeatId())
                .seatNumber(seat.getSeatNumber())
                .seatRow(seat.getSeatRow())
                .seatTypeId(seat.getSeatType().getSeatTypeId())
                .roomId(seat.getRoom().getRoomId())
                .build();
    }
    @Override
    public SeatDto create(SeatDto seatDto) throws Exception {
        Seat seat = Seat.builder()
                .seatNumber(seatDto.getSeatNumber())
                .seatRow(seatDto.getSeatRow())
                .seatType(seatTypeRepository.findById(seatDto.getSeatTypeId()).orElseThrow(() -> new Exception("Không tìm thấy loại ghế có ID: " + seatDto.getSeatTypeId())))
                .build();
        return convertToDto(seatRepository.save(seat));
    }

    @Override
    public List<SeatDto> reads() {
        return seatRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public SeatDto read(Long seatId) throws Exception {
        return seatRepository.findById(seatId)
                .map(this::convertToDto)
                .orElseThrow(() -> new Exception("Không tìm thấy ghế có ID: " + seatId));
    }

    @Override
    public SeatDto update(Long seatId, SeatDto seatDto) throws Exception {
        Seat seat = seatRepository.findById(seatId).orElseThrow(() -> new Exception("Không tìm thấy ghế có ID: " + seatId));

        return convertToDto(seatRepository.save(seat.toBuilder()
                .seatNumber(seatDto.getSeatNumber())
                .seatRow(seatDto.getSeatRow())
                .seatType(seatTypeRepository.findById(seatDto.getSeatTypeId()).orElseThrow(() -> new Exception("Không tìm thấy loại ghế có ID: " + seatDto.getSeatTypeId())))
                .build()));
    }

    @Override
    public void delete(Long seatId) throws Exception {
        Seat seat = seatRepository.findById(seatId).orElseThrow(() -> new Exception("Không tìm thấy ghế có ID: " + seatId));
        seatRepository.delete(seat);
    }
}

