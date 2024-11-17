package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.GenreDto;
import org.example.final_btl_datve.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(genreService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(genreService.read(id));
    }

    // Xem phim theo thể loại
    @GetMapping("/movie/{id}")
    public ResponseEntity<?> getMoviesByGenre(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(genreService.getMoviesByGenre(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody GenreDto genreDto) throws Exception{
        return ResponseEntity.ok().body(genreService.create(genreDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody GenreDto genreDto) throws Exception{
        return ResponseEntity.ok().body(genreService.update(id, genreDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception{
        genreService.delete(id);
        return ResponseEntity.ok("Xóa thể loại thành công");
    }
}

