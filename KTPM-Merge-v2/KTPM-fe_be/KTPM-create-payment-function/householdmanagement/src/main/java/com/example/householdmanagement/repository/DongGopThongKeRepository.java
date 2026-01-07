package com.example.householdmanagement.repository;

import com.example.householdmanagement.dto.HoDongGopDTO;
import com.example.householdmanagement.dto.TienDoDongGopDTO;
import com.example.householdmanagement.entity.LoaiPhi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DongGopThongKeRepository extends JpaRepository<LoaiPhi, Long> {

    /**
     * Thống kê tiến độ đóng góp của các khoản KHÔNG BẮT BUỘC
     * Tổng tiền đã đóng so với mục tiêu (DINHMUC)
     */
    @Query("""
SELECT new com.example.householdmanagement.dto.TienDoDongGopDTO(
    lp.maLoaiPhi,
    lp.tenLoaiPhi,
    lp.dinhMuc,
    lp.mucTieu,
    COALESCE(SUM(tp.soTien), CAST(0 AS java.math.BigDecimal)),
    CASE
        WHEN lp.dinhMuc IS NULL OR lp.dinhMuc = 0
            THEN CAST(0 AS java.math.BigDecimal)
        ELSE (COALESCE(SUM(tp.soTien), CAST(0 AS java.math.BigDecimal)) * 100 / lp.dinhMuc)
    END
)
FROM LoaiPhi lp
LEFT JOIN DotThu d ON d.loaiPhi = lp
LEFT JOIN ThuPhi tp ON tp.dotThu = d
WHERE lp.batBuoc = false
GROUP BY lp.maLoaiPhi, lp.tenLoaiPhi, lp.dinhMuc, lp.mucTieu
""")
    List<TienDoDongGopDTO> thongKeTienDoDongGop();





    /**
     * Danh sách các hộ đã đóng cho 1 loại phí đóng góp
     */
    @Query("""
        SELECT new com.example.householdmanagement.dto.HoDongGopDTO(
            hk.soHoKhau,
            hk.diaChi,
            xp.tenXaPhuong,
            tp.soTien
        )
        FROM ThuPhi tp
        JOIN tp.hoKhau hk
        JOIN hk.xaPhuong xp
        JOIN tp.dotThu d
        JOIN d.loaiPhi lp
        WHERE lp.maLoaiPhi = :maLoaiPhi
    """)
    List<HoDongGopDTO> danhSachHoDaDong(@Param("maLoaiPhi") Long maLoaiPhi);
}
