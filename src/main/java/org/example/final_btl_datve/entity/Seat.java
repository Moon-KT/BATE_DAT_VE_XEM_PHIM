package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.final_btl_datve.entity.enumModel.SeatStatus;
import org.example.final_btl_datve.entity.enumModel.SeatTypeName;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "seat_id")
    private Long seatId;

    @Column(name = "seat_row")
    private String seatRow;

    @Column(name = "seat_number")
    private Integer seatNumber;

    @ManyToOne
    @JoinColumn(name = "seat_type_id")
    private SeatType seatType;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ScreeningRoom room;

    @OneToMany(mappedBy = "seat")
    @JsonIgnore
    private List<Booking_Seat> bookingSeats;
}
