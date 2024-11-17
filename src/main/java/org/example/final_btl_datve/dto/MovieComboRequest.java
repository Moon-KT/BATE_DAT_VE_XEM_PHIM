package org.example.final_btl_datve.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@Builder
public class MovieComboRequest {
    private String name;
    private String poster;
    private List<String> genres;
    private int duration;
    private long views;
    private Double totalPrice;
    private List<String> combo;
}
