package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.BookingRequest;
import org.example.final_btl_datve.dto.BookingResponse;
import org.example.final_btl_datve.dto.UserDto;
import org.example.final_btl_datve.entity.Booking;
import org.example.final_btl_datve.entity.enumModel.BookingStatus;
import org.example.final_btl_datve.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/booking")
public class BookingController {
    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequest bookingRequestDto) {
        try {
            System.out.println("Booking request: " + bookingRequestDto);
            BookingResponse bookingResponse = bookingService.bookTicket(bookingRequestDto);
            return ResponseEntity.ok(bookingResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingTickets() {
        return ResponseEntity.ok(bookingService.getPendingTickets());
    }

    @GetMapping("{bookingId}/status")
    public ResponseEntity<?> getBookingStatus(@PathVariable Long bookingId) {
        BookingStatus bookingStatus = bookingService.getBookingStatus(bookingId);
        System.out.println("Booking status: " + bookingStatus);
        return ResponseEntity.ok(bookingService.getBookingStatus(bookingId));
    }

    @DeleteMapping("{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @PutMapping("booking/{bookingId}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long bookingId) throws Exception {
        bookingService.approveBooking(bookingId);
        return ResponseEntity.ok("Booking approved successfully");
    }
}
