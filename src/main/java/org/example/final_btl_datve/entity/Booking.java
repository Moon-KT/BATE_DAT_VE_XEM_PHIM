package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.final_btl_datve.entity.enumModel.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showtime;

    private Double totalPrice;

    private Double pointsEarned; // Điểm tích lũy từ booking này

    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToMany(mappedBy = "booking",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking_Seat> booking_seats;

    @OneToMany(mappedBy = "booking",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking_Combo> booking_combos;

    @PrePersist
    public void calculatePoints(){
        if (user != null && user.getMembership() != null) {
            // Tính điểm tích lũy dựa trên tỷ lệ từ Membership
            this.pointsEarned = totalPrice * user.getMembership().getPointRate();
        } else {
            this.pointsEarned = 0.0;  // Nếu không có Membership, không tính điểm
        }
    }
}
