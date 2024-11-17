package org.example.final_btl_datve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.PromotionType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDto {
    private Long promotionId;
    private String promotionName;
    private String promotionDescription;
    private LocalDateTime promotionStartDate;
    private LocalDateTime promotionEndDate;

    private PromotionType promotionType;

    private Double price;
}

