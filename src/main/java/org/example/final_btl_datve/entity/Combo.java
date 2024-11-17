package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.List;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "combo_offers")
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "combo_id")
    private Long comboId;

    @Nationalized
    @Column(name = "combo_name")
    private String comboName;

    @Nationalized
    @Column(name = "description", length = 1000)
    private String comboDescription;

    @Column(name = "image_combo")
    private String imageCombo;

    private Double price;

    @OneToMany(mappedBy = "combo")
    @JsonIgnore
    private List<Booking_Combo> bookingComboList;
}
