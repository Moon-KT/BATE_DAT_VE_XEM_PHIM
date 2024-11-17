package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.ComboDto;
import org.example.final_btl_datve.service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/combos")
public class ComboController {
    private final ComboService comboService;

    @Autowired
    public ComboController(ComboService comboService) {
        this.comboService = comboService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads() {
        return ResponseEntity.ok().body(comboService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(Long id) throws Exception {
        return ResponseEntity.ok().body(comboService.read(id));
    }

    @PostMapping
    public ResponseEntity<?> create(ComboDto comboDto) throws Exception {
        return ResponseEntity.ok().body(comboService.create(comboDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Long id, ComboDto comboDto) throws Exception {
        return ResponseEntity.ok().body(comboService.update(id, comboDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Long id) throws Exception {
        comboService.delete(id);
        return ResponseEntity.ok("Xóa combo thành công");
    }
}
