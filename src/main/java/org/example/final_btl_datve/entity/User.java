package org.example.final_btl_datve.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.final_btl_datve.entity.enumModel.Gender;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Nationalized
    @Column(name = "user_name", unique = true, length = 50)
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    @JsonIgnore
    private String password;

    @Column(name = "phone")
    private String phone;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Nationalized
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Nationalized
    private String address;

    private Double totalSpent = 0.0; // Tổng số tiền đã chi

    @Column(name = "accumulated_points") // Điểm tích lũy
    private Double accumulatedPoints;

    @Column(name = "start_join")
    private LocalDateTime creatAt; // Ngày tham gia hội viên

    private Boolean enabled; // Trạng thái xác thực email

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<UserRole> userRoles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings;

    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userRoles == null ? List.of() : userRoles.stream()
                .map(UserRole::getRole)
                .map(Role::getRoleName)
                .map(roleName -> (GrantedAuthority) roleName::name)
                .toList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return username;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;    }

    @Override
    public boolean isEnabled() {
        return true;    }
}

