package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.TamTru;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TamTruRepository extends JpaRepository<TamTru, Long> {
    List<TamTru> findByNhanKhau_MaNhanKhau(Long maNhanKhau);
    
    @Query("SELECT t FROM TamTru t WHERE t.trangThai = :trangThai")
    List<TamTru> findByTrangThai(@Param("trangThai") String trangThai);
    
    @Query("SELECT t FROM TamTru t WHERE t.tuNgay BETWEEN :tuNgay AND :denNgay OR t.denNgay BETWEEN :tuNgay AND :denNgay")
    List<TamTru> findByThoiGianBetween(@Param("tuNgay") LocalDateTime tuNgay, @Param("denNgay") LocalDateTime denNgay);

    // added: return list of maTamTru for TamTru where the resident's name contains the query (case-insensitive)
    @Query("SELECT t.maTamTru FROM TamTru t WHERE LOWER(t.nhanKhau.hoTen) LIKE CONCAT('%', LOWER(:q), '%')")
    List<Long> findMaTamTruByNhanKhauHoTenContainingIgnoreCase(@Param("q") String q);
}
