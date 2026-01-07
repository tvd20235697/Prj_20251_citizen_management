package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.XaPhuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface XaPhuongRepository extends JpaRepository<XaPhuong, Long> {
}


