package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.LichSuThayDoiHoKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuThayDoiHoKhauRepository extends JpaRepository<LichSuThayDoiHoKhau, Long> {
    List<LichSuThayDoiHoKhau> findByHoKhau_SoHoKhauOrderByNgayThayDoiDesc(Long soHoKhau);
    
    @Query("SELECT l FROM LichSuThayDoiHoKhau l " +
           "INNER JOIN FETCH l.hoKhau h " +
           "ORDER BY l.ngayThayDoi DESC")
    List<LichSuThayDoiHoKhau> findAllWithHoKhau();
}
