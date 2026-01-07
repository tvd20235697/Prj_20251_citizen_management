package com.example.householdmanagement.repository;

import com.example.householdmanagement.dto.PhiVeSinhHouseholdDTO;
import com.example.householdmanagement.entity.HoKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhiVeSinhRepository extends JpaRepository<HoKhau, Long> {

    /**
     * Danh sách hộ ĐÃ đóng phí vệ sinh theo năm
     */
    @Query("""
        SELECT new com.example.householdmanagement.dto.PhiVeSinhHouseholdDTO(
            hk.soHoKhau,
            hk.diaChi,
            xp.tenXaPhuong,
            tp.soTien,
            'DA_DONG'
        )
        FROM ThuPhi tp
        JOIN tp.hoKhau hk
        JOIN hk.xaPhuong xp
        JOIN tp.dotThu d
        JOIN d.loaiPhi lp
        WHERE lp.tenLoaiPhi = 'Phí vệ sinh'
          AND FUNCTION('year', d.ngayBatDau) = :nam
    """)
    List<PhiVeSinhHouseholdDTO> findHouseholdsDaDong(@Param("nam") int nam);


    /**
     * Danh sách hộ CHƯA đóng phí vệ sinh theo năm
     */
    @Query("""
        SELECT new com.example.householdmanagement.dto.PhiVeSinhHouseholdDTO(
            hk.soHoKhau,
            hk.diaChi,
            xp.tenXaPhuong,
            CAST(0 AS java.math.BigDecimal),
            'CHUA_DONG'
        )
        FROM HoKhau hk
        JOIN hk.xaPhuong xp
        WHERE NOT EXISTS (
            SELECT 1
            FROM ThuPhi tp
            JOIN tp.dotThu d
            JOIN d.loaiPhi lp
            WHERE tp.hoKhau = hk
              AND lp.tenLoaiPhi = 'Phí vệ sinh'
              AND FUNCTION('year', d.ngayBatDau) = :nam
        )
    """)
    List<PhiVeSinhHouseholdDTO> findHouseholdsChuaDong(@Param("nam") int nam);


    /**
     * Tổng số hộ trong hệ thống
     */
    @Query("SELECT COUNT(hk) FROM HoKhau hk")
    Long countTotalHouseholds();


    /**
     * Số hộ đã đóng phí vệ sinh theo năm
     */
    @Query("""
        SELECT COUNT(DISTINCT tp.hoKhau.soHoKhau)
        FROM ThuPhi tp
        JOIN tp.dotThu d
        JOIN d.loaiPhi lp
        WHERE lp.tenLoaiPhi = 'Phí vệ sinh'
          AND FUNCTION('year', d.ngayBatDau) = :nam
    """)
    Long countDaDong(@Param("nam") int nam);
}
