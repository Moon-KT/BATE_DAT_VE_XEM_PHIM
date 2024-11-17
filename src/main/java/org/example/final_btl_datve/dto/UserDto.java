package org.example.final_btl_datve.dto;

import lombok.Builder;
import lombok.Data;
import org.example.final_btl_datve.entity.enumModel.Gender;
import org.example.final_btl_datve.entity.enumModel.ERole;
import org.example.final_btl_datve.entity.enumModel.MembershipType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder(toBuilder = true)
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String password;
    private String phone;
    private LocalDate birthday;
    private Gender gender;
    private String address;
    private ERole role;
//    private Double totalSpent;
    private LocalDateTime createdAt;
//    private Boolean enabled;
    private MembershipType membershipType;

    //private List<BookingRequest> bookingRequests;

}
