package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.CanBo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanBoRepository extends JpaRepository<CanBo, Long> {
}

