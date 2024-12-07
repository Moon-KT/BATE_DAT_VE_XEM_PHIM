package org.example.final_btl_datve.repository;

import org.example.final_btl_datve.entity.Role;
import org.example.final_btl_datve.entity.enumModel.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName);
}
