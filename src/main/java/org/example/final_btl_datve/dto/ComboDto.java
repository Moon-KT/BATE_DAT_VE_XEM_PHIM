package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboDto {
    private Long comboId;
    private String comboName;
    private String comboDescription;
    private String imageCombo;
    private double price;
}
