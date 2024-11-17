package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.SeatDto;
import org.example.final_btl_datve.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seats")
public class SeatController {
    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(seatService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(seatService.read(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody SeatDto seatDto) throws Exception{
        return ResponseEntity.ok().body(seatService.create(seatDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody SeatDto seatDto) throws Exception{
        return ResponseEntity.ok().body(seatService.update(id, seatDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception{
        seatService.delete(id);
        return ResponseEntity.ok("Xóa ghế thành công");
    }
}
