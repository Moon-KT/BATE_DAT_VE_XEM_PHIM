package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.SeatStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDto {
    private Long seatId;
    private String seatRow;
    private Integer seatNumber;
    private String seatStatus;
    private Double seatPrice;
    private Long roomId;
    private Long seatTypeId;
}
