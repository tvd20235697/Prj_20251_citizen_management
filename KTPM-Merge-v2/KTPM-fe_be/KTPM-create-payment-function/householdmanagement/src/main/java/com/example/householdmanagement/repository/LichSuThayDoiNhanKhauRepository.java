package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.LichSuThayDoiNhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuThayDoiNhanKhauRepository extends JpaRepository<LichSuThayDoiNhanKhau, Long> {
    @Query("SELECT l FROM LichSuThayDoiNhanKhau l " +
           "INNER JOIN FETCH l.nhanKhau n " +
           "INNER JOIN FETCH n.hoKhau h " +
           "ORDER BY l.ngayThayDoi DESC")
    List<LichSuThayDoiNhanKhau> findAllWithNhanKhauAndHoKhau();
    
    @Query("SELECT l FROM LichSuThayDoiNhanKhau l " +
           "INNER JOIN FETCH l.nhanKhau n " +
           "WHERE n.maNhanKhau = :maNhanKhau " +
           "ORDER BY l.ngayThayDoi DESC")
    List<LichSuThayDoiNhanKhau> findByNhanKhau_MaNhanKhauOrderByNgayThayDoiDesc(@Param("maNhanKhau") Long maNhanKhau);
    
    @Query("SELECT l FROM LichSuThayDoiNhanKhau l " +
           "INNER JOIN FETCH l.nhanKhau n " +
           "INNER JOIN FETCH n.hoKhau h " +
           "WHERE h.soHoKhau = :soHoKhau " +
           "ORDER BY l.ngayThayDoi DESC")
    List<LichSuThayDoiNhanKhau> findBySoHoKhauOrderByNgayThayDoiDesc(@Param("soHoKhau") Long soHoKhau);
}


