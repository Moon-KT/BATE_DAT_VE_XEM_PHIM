package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {
    private final MembershipService membershipService;

    @Autowired
    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads() {
        return ResponseEntity.ok().body(membershipService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(Long id) throws Exception {
        return ResponseEntity.ok().body(membershipService.read(id));
    }

}
