package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.PromotionDto;
import org.example.final_btl_datve.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {
    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(promotionService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(promotionService.read(id));
    }

    // Add search by types
    @GetMapping("/types")
    public ResponseEntity<?> search(@RequestParam List<String> types){
        return ResponseEntity.ok().body(promotionService.findPromotionByTypes(types));
    }

    // Add search by name
    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchPromotion(@PathVariable String name) throws Exception{
        return ResponseEntity.ok().body(promotionService.searchPromotion(name));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody PromotionDto promotionDto) throws Exception{
        return ResponseEntity.ok().body(promotionService.create(promotionDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody PromotionDto promotionDto) throws Exception{
        return ResponseEntity.ok().body(promotionService.update(id, promotionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception{
        promotionService.delete(id);
        return ResponseEntity.ok("Xóa khuyến mãi thành công");
    }
}