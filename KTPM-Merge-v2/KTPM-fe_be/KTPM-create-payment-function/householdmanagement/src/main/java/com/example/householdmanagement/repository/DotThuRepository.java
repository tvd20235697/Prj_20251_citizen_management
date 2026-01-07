package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.DotThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DotThuRepository extends JpaRepository<DotThu, Long> {
    // Sử dụng JOIN FETCH để đảm bảo LoaiPhi được load cùng với DotThu
    @Query("SELECT dt FROM DotThu dt LEFT JOIN FETCH dt.loaiPhi")
    @Override
    List<DotThu> findAll();
    
    @Query("SELECT dt FROM DotThu dt LEFT JOIN FETCH dt.loaiPhi WHERE dt.maDotThu = :id")
    @Override
    Optional<DotThu> findById(@Param("id") Long id);
}
