package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeDto {
    private Long showtimeId;
    private LocalDateTime startTime;
    private Long roomId;
    private Long movieId;
    private Long emptySeats;
}
