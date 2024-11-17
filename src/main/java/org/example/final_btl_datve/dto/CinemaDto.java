package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CinemaDto {
    private Long cinemaId;
    private String cinemaName;
    private String hotline;
    private String detailedAddress;
    private Long locationId;
}
