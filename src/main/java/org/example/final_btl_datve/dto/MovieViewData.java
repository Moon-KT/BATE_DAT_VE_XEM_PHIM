package org.example.final_btl_datve.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Comparator;
import java.util.List;

@Data
public class MovieViewData {
    private String name;
    private String poster;
    private List<String> genres;
    private int duration;
    private long views;
}
