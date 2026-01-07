package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.LoaiPhi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiPhiRepository extends JpaRepository<LoaiPhi, Long> {
    // Chỉ giữ JpaRepository cơ bản - không cần thêm query phức tạp
}
