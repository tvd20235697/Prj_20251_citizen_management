package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.HoKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoKhauRepository extends JpaRepository<HoKhau, Long> {
    @Query("SELECT h FROM HoKhau h WHERE h.diaChi LIKE %:diaChi%")
    List<HoKhau> findByDiaChiContaining(@Param("diaChi") String diaChi);
    
    List<HoKhau> findByXaPhuong_MaXaPhuong(Long maXaPhuong);
}


