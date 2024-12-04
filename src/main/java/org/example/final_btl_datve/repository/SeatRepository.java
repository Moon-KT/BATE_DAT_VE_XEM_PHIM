package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    @Query("SELECT s FROM Seat s WHERE s.room.roomId = ?1")
    List<Seat> findSeatsByRoom(Long roomId);

}
