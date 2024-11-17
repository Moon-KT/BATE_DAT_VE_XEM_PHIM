package org.example.final_btl_datve.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.final_btl_datve.entity.enumModel.MembershipType;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "memberships")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "membership_id")
    private Long membershipID;

    @Column(name = "membership_type")
    @Enumerated(EnumType.STRING)
    private MembershipType membership_type;

    @Column(name = "point_rate")
    private Double pointRate;

    @OneToMany(mappedBy = "membership", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> user;
}

