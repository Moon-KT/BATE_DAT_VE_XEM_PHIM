package org.example.final_btl_datve.dto;

import lombok.*;
import org.example.final_btl_datve.entity.Showtime;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString
public class BookingRequest {
    private Long userId;
    private Long showtimeId;
    private Double totalPrice;
    private Double pointUse;
    private List<Long> seatIds;
    private List<Long> comboIds;
}
