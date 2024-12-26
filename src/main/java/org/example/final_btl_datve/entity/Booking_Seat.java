package org.example.final_btl_datve.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.final_btl_datve.entity.enumModel.SeatStatus;
import org.example.final_btl_datve.entity.key.BookingSeatKey;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "booking_seat")
public class Booking_Seat {
    @EmbeddedId
    private BookingSeatKey id;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_status", nullable = false)
    private SeatStatus status;


    @ManyToOne
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @MapsId("seatId")
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
}
