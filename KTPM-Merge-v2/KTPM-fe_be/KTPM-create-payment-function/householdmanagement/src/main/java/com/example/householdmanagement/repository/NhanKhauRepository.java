package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.NhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NhanKhauRepository extends JpaRepository<NhanKhau, Long> {
    
    // Kiểm tra nhân khẩu có tồn tại không (chỉ kiểm tra ID, không load association) - MySQL
    @Query(value = "SELECT EXISTS(SELECT 1 FROM NHANKHAU WHERE MANHANKHAU = :id)", nativeQuery = true)
    boolean existsByIdNative(@Param("id") Long id);
    
    // Lấy thông tin cơ bản của nhân khẩu (chỉ các trường cần thiết, không load association) - MySQL
    @Query(value = "SELECT HOTEN FROM NHANKHAU WHERE MANHANKHAU = :id LIMIT 1", nativeQuery = true)
    String getHoTenById(@Param("id") Long id);
    List<NhanKhau> findByHoKhau_SoHoKhau(Long soHoKhau);
    
    List<NhanKhau> findByHoTenContainingIgnoreCase(String hoTen);
    
    List<NhanKhau> findByGioiTinh(String gioiTinh);
    
    @Query("SELECT n FROM NhanKhau n WHERE n.ngaySinh BETWEEN :tuNgay AND :denNgay")
    List<NhanKhau> findByNgaySinhBetween(@Param("tuNgay") LocalDateTime tuNgay, @Param("denNgay") LocalDateTime denNgay);
    
    @Query("SELECT n FROM NhanKhau n WHERE n.trangThai = :trangThai")
    List<NhanKhau> findByTrangThai(@Param("trangThai") String trangThai);
    
    @Query("SELECT n FROM NhanKhau n WHERE n.hoKhau.soHoKhau = :soHoKhau AND n.quanHeVoiChuHo = 'Chu ho'")
    NhanKhau findChuHoBySoHoKhau(@Param("soHoKhau") Long soHoKhau);
    
    List<NhanKhau> findByCmnd(String cmnd);

    @Query("select n from NhanKhau n where n.quanHeVoiChuHo = :role and lower(n.hoTen) like lower(concat('%', :q, '%'))")
    List<NhanKhau> searchByRoleAndHoTen(@Param("role") String role, @Param("q") String q);

    @Query("select n from NhanKhau n where n.quanHeVoiChuHo = :role and n.cmnd like concat('%', :q, '%')")
    List<NhanKhau> searchByRoleAndCmnd(@Param("role") String role, @Param("q") String q);

    @Query("select n from NhanKhau n where n.quanHeVoiChuHo = :role and n.hoKhau.soHoKhau = :soHo")
    List<NhanKhau> searchByRoleAndSoHo(@Param("role") String role, @Param("soHo") Long soHo);
}

