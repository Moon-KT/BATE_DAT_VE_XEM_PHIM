package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.MembershipDto;
import org.example.final_btl_datve.entity.Membership;
import org.example.final_btl_datve.repository.MembershipRepository;
import org.example.final_btl_datve.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MembershipServiceImpl implements MembershipService {
    private final MembershipRepository membershipRepository;

    @Autowired
    public MembershipServiceImpl(MembershipRepository membershipRepository) {
        this.membershipRepository = membershipRepository;
    }

    private MembershipDto convertToDto(Membership membership) {
        return MembershipDto.builder()
                .membershipId(membership.getMembershipID())
                .membershipName(membership.getMembership_type())
                .build();
    }

    @Override
    public List<MembershipDto> reads() {
        return membershipRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public MembershipDto read(Long membershipID) throws Exception {
        return membershipRepository.findById(membershipID).map(this::convertToDto).orElseThrow(() -> new Exception("Membership not found"));
    }
}
