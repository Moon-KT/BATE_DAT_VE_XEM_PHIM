package org.example.final_btl_datve.controller;

import org.example.final_btl_datve.dto.BookingRequest;
import org.example.final_btl_datve.dto.BookingResponse;
import org.example.final_btl_datve.service.BookingService;
import org.example.final_btl_datve.service.BookingTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/bookTicket")
public class BookingTicketController {
    private final BookingTicketService bookingService;

    @Autowired
    public BookingTicketController(BookingTicketService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> getBookings(@RequestBody BookingRequest bookingRequestDto) {
        try {
            BookingResponse bookingResponse = bookingService.getBookings(bookingRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Booking created successfully with ID: " + bookingResponse.getBookingId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating booking: " + e.getMessage());
        }
    }
}
