package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.ShowtimeDto;
import org.example.final_btl_datve.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {
    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ShowtimeDto showtimeDto) throws Exception{
        return ResponseEntity.ok().body(showtimeService.create(showtimeDto));
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(showtimeService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable long id) throws Exception{
        return ResponseEntity.ok().body(showtimeService.read(id));
    }

    //Xem suất chiếu theo tên phim
    @GetMapping("/movie/{movieName}")
    public ResponseEntity<?> getShowtimeByMovieId(@PathVariable String movieName){
        return ResponseEntity.ok().body(showtimeService.getShowtimeByMovieName(movieName));
    }

    //Tìm suất chiếu theo từ khóa
    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> search(@PathVariable String keyword) throws Exception{
        return ResponseEntity.ok().body(showtimeService.search(keyword));
    }

    //Tìm phòng chiếu theo mã suất chiếu
    @GetMapping("/room/{showtimeId}")
    public ResponseEntity<?> getRoomByShowtimeId(@PathVariable long showtimeId) throws Exception{
        return ResponseEntity.ok().body(showtimeService.getRoomByShowtimeId(showtimeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable long id,
                                    @RequestBody ShowtimeDto showtimeDto) throws Exception{
        return ResponseEntity.ok().body(showtimeService.update(id, showtimeDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) throws Exception{
        showtimeService.delete(id);
        return ResponseEntity.ok("Xóa suất chiếu thành công");
    }
}