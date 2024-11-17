package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.MovieComboRequest;
import org.example.final_btl_datve.dto.MovieDto;
import org.example.final_btl_datve.dto.MovieViewData;
import org.example.final_btl_datve.entity.Movie;
import org.example.final_btl_datve.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(movieService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok().body(movieService.read(id));
    }

//    @GetMapping("/getMovies/{keyword}")
//    public ResponseEntity<?> getMovies(@PathVariable String keyword) {
//        List<MovieComboRequest> nowShowingMovies = movieService.getMovies(keyword);
//        return ResponseEntity.ok(nowShowingMovies);
//    }

    @GetMapping("/new")
    public ResponseEntity<?> getNewMovies() {
        return ResponseEntity.ok(movieService.getNewMovies());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingMovies() {
        List<MovieDto> upcomingMovies = movieService.getUpcomingMovies();
        return ResponseEntity.ok(upcomingMovies);
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<?> getMostViewedMovies() {
        List<MovieDto> mostViewedMovies = movieService.getMostViewedMovies();
        return ResponseEntity.ok(mostViewedMovies);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody MovieDto movieDto) throws Exception{
        return ResponseEntity.ok().body(movieService.create(movieDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody MovieDto movieDto) throws Exception{
        return ResponseEntity.ok().body(movieService.update(id, movieDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception{
        movieService.delete(id);
        return ResponseEntity.ok("Xóa phim thành công");
    }

    // Search movie by keyword
    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> search(@PathVariable String keyword){
        return ResponseEntity.ok().body(movieService.search(keyword));
    }
}

