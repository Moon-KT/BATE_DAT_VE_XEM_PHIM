package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.Showtime;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class BookingRequest {
    private Long userId;
    private Long showtimeId;
    private Double totalPrice;
    private List<Long> seatIds;
    private List<Long> comboIds;
}
