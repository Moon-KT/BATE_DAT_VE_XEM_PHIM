package org.example.final_btl_datve.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    @Column(name = "seat_status")
    private SeatStatus status;


    @ManyToOne
    @MapsId("bookingId")
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @MapsId("seatId")
    @JoinColumn(name = "seat_id")
    private Seat seat;

}
