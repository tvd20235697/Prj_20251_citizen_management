package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.TamVang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TamVangRepository extends JpaRepository<TamVang, Long> {
    List<TamVang> findByNhanKhau_MaNhanKhau(Long maNhanKhau);
    
    @Query("SELECT t FROM TamVang t WHERE t.trangThai = :trangThai")
    List<TamVang> findByTrangThai(@Param("trangThai") String trangThai);
    
    @Query("SELECT t FROM TamVang t WHERE t.tuNgay BETWEEN :tuNgay AND :denNgay OR (t.denNgay IS NOT NULL AND t.denNgay BETWEEN :tuNgay AND :denNgay)")
    List<TamVang> findByThoiGianBetween(@Param("tuNgay") LocalDateTime tuNgay, @Param("denNgay") LocalDateTime denNgay);
}


