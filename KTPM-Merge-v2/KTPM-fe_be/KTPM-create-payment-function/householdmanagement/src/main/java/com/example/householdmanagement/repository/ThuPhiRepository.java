package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.ThuPhi;
import com.example.householdmanagement.dto.UnpaidHouseholdDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThuPhiRepository extends JpaRepository<ThuPhi, Long> {

    // Sử dụng LEFT JOIN FETCH để tránh lỗi khi DotThu hoặc HoKhau không tồn tại
    @Query("SELECT DISTINCT t FROM ThuPhi t LEFT JOIN FETCH t.dotThu dt LEFT JOIN FETCH dt.loaiPhi LEFT JOIN FETCH t.hoKhau")
    @Override
    List<ThuPhi> findAll();
    
    @Query("SELECT DISTINCT t FROM ThuPhi t LEFT JOIN FETCH t.dotThu dt LEFT JOIN FETCH dt.loaiPhi LEFT JOIN FETCH t.hoKhau WHERE t.maThuPhi = :id")
    @Override
    Optional<ThuPhi> findById(@Param("id") Long id);

    /**
     * Tổng số tiền đã thu theo LOẠI PHÍ
     */
    @Query("""
        SELECT COALESCE(SUM(t.soTien), 0)
        FROM ThuPhi t
        WHERE t.dotThu.loaiPhi.maLoaiPhi = :maLoaiPhi
    """)
    BigDecimal totalCollectedByLoai(@Param("maLoaiPhi") Long maLoaiPhi);

    /**
     * Đếm số NHÂN KHẨU đã đóng theo LOẠI PHÍ
     */
    @Query("""
        SELECT COUNT(DISTINCT nk.maNhanKhau)
        FROM ThuPhi t
        JOIN t.hoKhau hk
        JOIN NhanKhau nk
        WHERE nk.hoKhau = hk
          AND t.dotThu.loaiPhi.maLoaiPhi = :maLoaiPhi
    """)
    Long countDistinctPeoplePaidByLoai(@Param("maLoaiPhi") Long maLoaiPhi);

    /**
     * Danh sách HỘ CHƯA ĐÓNG theo LOẠI PHÍ
     */
    @Query("""
        SELECT new com.example.householdmanagement.dto.UnpaidHouseholdDto(
            h.soHoKhau,
            h.diaChi,
            h.xaPhuong.tenXaPhuong,
            COALESCE((
                SELECT SUM(t2.soTien)
                FROM ThuPhi t2
                WHERE t2.hoKhau = h
                  AND t2.dotThu.loaiPhi.maLoaiPhi = :maLoaiPhi
            ), 0),
            lp.dinhMuc,
            (SELECT COUNT(nk) FROM NhanKhau nk WHERE nk.hoKhau = h)
        )
        FROM HoKhau h
        JOIN LoaiPhi lp
        WHERE lp.maLoaiPhi = :maLoaiPhi
          AND NOT EXISTS (
              SELECT 1
              FROM ThuPhi t
              WHERE t.hoKhau = h
                AND t.dotThu.loaiPhi.maLoaiPhi = :maLoaiPhi
          )
    """)
    List<UnpaidHouseholdDto> findUnpaidHouseholdsByLoai(@Param("maLoaiPhi") Long maLoaiPhi);
}
