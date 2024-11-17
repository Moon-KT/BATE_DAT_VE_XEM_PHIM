package org.example.final_btl_datve.dto;

import lombok.Builder;
import lombok.Data;
import org.example.final_btl_datve.entity.enumModel.MembershipType;

@Data
@Builder(toBuilder = true)
public class MembershipDto {
    private Long membershipId;
    private MembershipType membershipName;
}
