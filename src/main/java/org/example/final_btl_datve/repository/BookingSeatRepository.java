package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Booking_Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSeatRepository extends JpaRepository<Booking_Seat, Long> {

}
