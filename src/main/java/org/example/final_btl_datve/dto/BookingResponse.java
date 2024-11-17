package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long bookingId;
    private Long userId;
    private Long showtimeId;
    private Double totalPrice;
    private Double pointsEarned;   // Điểm tích lũy từ booking này
    private LocalDateTime bookingTime;
    private List<Long> seatIds;    // Danh sách ID ghế đã đặt
    private List<Long> comboIds;   // Danh sách ID combo trong booking
    private String message;
}
