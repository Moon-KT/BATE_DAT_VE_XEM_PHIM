package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    @Query(value = "SELECT * FROM promotions p " +
            "WHERE p.promotion_description LIKE %:keyword% " +
            "OR p.promotion_name LIKE %:keyword% " +
            "OR p.promotion_type LIKE %:keyword%", nativeQuery = true)
    List<Promotion> findPromotionsByKeyword(String keyword);

    @Query("SELECT p FROM Promotion p WHERE p.promotionDescription IN :types")
    List<Promotion> findPromotionByTypes(List<String> types);
}
