package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.CinemaDto;
import org.example.final_btl_datve.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cinemas")
public class CinemaController {
    @Autowired
    private CinemaService cinemaService;

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(cinemaService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(cinemaService.read(id));
    }

    // Xem phòng chiếu của rạp
    @GetMapping("/{cinemaID}/rooms")
    public ResponseEntity<?> getRoomByCinema(@PathVariable Long cinemaID) throws Exception{
        return ResponseEntity.ok().body(cinemaService.getRoomByCinema(cinemaID));
    }

    // Xem phim của rạp
    @GetMapping("/{cinemaID}/movies")
    public ResponseEntity<?> getMovieByCinema(@PathVariable Long cinemaID) throws Exception{
        return ResponseEntity.ok().body(cinemaService.getMovieByCinema(cinemaID));
    }

    @GetMapping("/search/{cinemaName}")
    public ResponseEntity<?> findByCinemaName(@PathVariable String cinemaName){
        return ResponseEntity.ok().body(cinemaService.findByCinemaName(cinemaName));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CinemaDto cinemaDto) throws Exception{
        return ResponseEntity.ok().body(cinemaService.create(cinemaDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody CinemaDto cinemaDto) throws Exception{
        return ResponseEntity.ok().body(cinemaService.update(id, cinemaDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception{
        cinemaService.delete(id);
        return ResponseEntity.ok("Xóa rạp thành công");
    }
}
