package org.example.final_btl_datve.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.Gender;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterDto {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
    private LocalDate birthday;
    private Gender gender;
}
