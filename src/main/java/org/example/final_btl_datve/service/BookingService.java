package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.BookingRequest;
import org.example.final_btl_datve.dto.BookingResponse;
import org.example.final_btl_datve.entity.Booking;
import org.example.final_btl_datve.entity.enumModel.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BookingService {
    BookingResponse bookTicket (BookingRequest bookingRequest);
    List<Booking> getPendingTickets();
    BookingStatus getBookingStatus(Long bookingId);
    void approveBooking(Long bookingId) throws Exception;
    void deleteBooking(Long bookingId);
}
