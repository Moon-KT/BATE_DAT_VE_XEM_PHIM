package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.UserDto;
import org.example.final_btl_datve.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> reads(){
        return ResponseEntity.ok().body(userService.reads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable long id) throws Exception{
        return ResponseEntity.ok().body(userService.read(id));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> search(@PathVariable String keyword) throws Exception{
        return ResponseEntity.ok().body(userService.search(keyword));
    }

    @GetMapping("/search/{userId}")
    public ResponseEntity<?> search(@PathVariable long userId) throws Exception{
        return ResponseEntity.ok().body(userService.searchId(userId));
    }

    @GetMapping("history/{userID}")
    public ResponseEntity<?> getBookingHistory(@PathVariable long userID) throws Exception {
        return ResponseEntity.ok().body(userService.getBookingHistory(userID));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody UserDto userDto) throws Exception{
        return ResponseEntity.ok().body(userService.create(userDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable long id,
                                    @RequestBody UserDto userDto)throws Exception{
        return ResponseEntity.ok().body(userService.update(id, userDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) throws Exception{
        userService.delete(id);
        return ResponseEntity.ok().build();
    }
}
