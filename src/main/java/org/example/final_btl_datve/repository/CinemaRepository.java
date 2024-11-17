package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    List<Cinema> findByCinemaNameContaining(String cinemaName);
}
