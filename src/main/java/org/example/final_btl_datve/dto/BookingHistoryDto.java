package org.example.final_btl_datve.dto;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingHistoryDto {
    private String movieName;
    private Timestamp bookingTime;
    private String comboDetails;
    private Long seatCount;
    private String cinemaName;
    private String roomName;
    private String seatNames;
    private Double point;

}