package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.example.final_btl_datve.entity.enumModel.PromotionType;
import org.hibernate.annotations.Nationalized;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "promotion_id")
    private Long promotionId;

    @Nationalized
    @Column(name = "promotion_name",length = 100)
    private String promotionName;

    @Nationalized
    @Column(name = "promotion_description",length = 1000)
    private String promotionDescription;

    @Column(name = "promotion_start_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime promotionStartDate;

    @Column(name = "promotion_end_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime promotionEndDate;

    @Column(name = "promotion_price")
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "promotion_type")
    private PromotionType promotionType;
}
