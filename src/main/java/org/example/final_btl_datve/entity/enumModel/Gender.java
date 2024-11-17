package org.example.final_btl_datve.entity.enumModel;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Gender {
    MALE("nam"),
    FEMALE("nữ"),
    OTHERS("khác");

    private String genderType;
}
