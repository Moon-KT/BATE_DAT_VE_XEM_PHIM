package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.BookingRequest;
import org.example.final_btl_datve.dto.BookingResponse;
import org.springframework.stereotype.Service;

@Service
public interface BookingTicketService {
    BookingResponse getBookings (BookingRequest bookingRequest);

}
