package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.MembershipDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MembershipService {
    //CRUD
    List<MembershipDto> reads();
    MembershipDto read(Long membershipID) throws Exception;
}
