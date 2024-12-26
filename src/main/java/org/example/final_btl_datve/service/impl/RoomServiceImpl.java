package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.RoomDto;
import org.example.final_btl_datve.dto.SeatDto;
import org.example.final_btl_datve.entity.ScreeningRoom;
import org.example.final_btl_datve.repository.CinemaRepository;
import org.example.final_btl_datve.repository.RoomRepository;
import org.example.final_btl_datve.service.RoomService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoomServiceImpl implements RoomService {

    private final RoomRepository screeningRoomRepository;

    private final CinemaRepository cinemaRepository;

    public RoomServiceImpl(RoomRepository screeningRoomRepository, CinemaRepository cinemaRepository) {
        this.screeningRoomRepository = screeningRoomRepository;
        this.cinemaRepository = cinemaRepository;
    }

    private RoomDto convertToDto(ScreeningRoom screeningRoom) {
        return RoomDto.builder()
                .roomId(screeningRoom.getRoomId())
                .roomName(screeningRoom.getRoomName())
                .cinemaId(screeningRoom.getCinema().getCinemaId())
                .build();
    }
    @Override
    public RoomDto create(RoomDto screeningRoomDto) throws Exception {
        return convertToDto(screeningRoomRepository.save(ScreeningRoom.builder()
                .roomName(screeningRoomDto.getRoomName())
                .cinema(cinemaRepository.findById(screeningRoomDto.getCinemaId()).orElseThrow(() -> {
                    return new Exception("Không tìm thấy rạp chiếu phim có ID: " + screeningRoomDto.getCinemaId());
                }))
                .build()));
    }

    @Override
    public List<RoomDto> reads() {
        return screeningRoomRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public RoomDto read(Long screeningRoomID) throws Exception {
        return screeningRoomRepository.findById(screeningRoomID)
                .map(this::convertToDto)
                .orElseThrow(() -> { return new Exception("Không tìm thấy phòng chiếu có ID: " + screeningRoomID);});
    }

    @Override
    public RoomDto update(Long screeningRoomID, RoomDto screeningRoomDto) throws Exception {
        ScreeningRoom screeningRoom = screeningRoomRepository.findById(screeningRoomID)
                .orElseThrow(() -> { return new Exception("Không tìm thấy phòng chiếu có ID: " + screeningRoomID);});
        screeningRoom.setRoomName(screeningRoomDto.getRoomName());
        screeningRoom.setCinema(cinemaRepository.findById(screeningRoomDto.getCinemaId()).orElseThrow(() -> {
            return new Exception("Không tìm thấy rạp chiếu phim có ID: " + screeningRoomDto.getCinemaId());
        }));
        return convertToDto(screeningRoomRepository.save(screeningRoom));
    }

    @Override
    public void delete(Long screeningRoomID) throws Exception {
        if(!screeningRoomRepository.existsById(screeningRoomID)) {
            throw new Exception("Không tìm thấy phòng chiếu có ID: " + screeningRoomID);
        }
        screeningRoomRepository.deleteById(screeningRoomID);
    }

    @Override
    public SeatDto readSeat(Long screeningRoomID, String seatRow, int seatNumber) throws Exception {
        ScreeningRoom screeningRoom = screeningRoomRepository.findById(screeningRoomID)
                .orElseThrow(() -> { return new Exception("Không tìm thấy phòng chiếu có ID: " + screeningRoomID);});
        return screeningRoom.getSeatList().stream()
                .filter(seat -> seat.getSeatRow().equals(seatRow) && seat.getSeatNumber() == seatNumber)
                .findFirst()
                .map(seat -> SeatDto.builder()
                        .roomId(screeningRoom.getRoomId())
                        .seatId(seat.getSeatId())
                        .seatRow(seat.getSeatRow())
                        .seatNumber(seat.getSeatNumber())
                        .build())
                .orElseThrow(() -> { return new Exception("Không tìm thấy ghế có hàng " + seatRow + " và số " + seatNumber);});
    }
}

