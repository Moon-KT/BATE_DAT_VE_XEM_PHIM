package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.SeatTypeName;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatTypeDto {
    private Long seatTypeId;
    private SeatTypeName seatTypeName;
    private Double seatPrice;
}
