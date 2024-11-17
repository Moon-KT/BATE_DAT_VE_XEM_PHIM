package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.SeatTypeName;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "seat_type")
public class SeatType {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)

    @Column(name = "seat_type_id")
    private Long seatTypeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_name")
    private SeatTypeName seatTypeName;

    @Column(name = "seat_price")
    private Double seatPrice;

    @OneToMany(mappedBy = "seatType")
    @JsonIgnore
    private List<Seat> seats;
}
