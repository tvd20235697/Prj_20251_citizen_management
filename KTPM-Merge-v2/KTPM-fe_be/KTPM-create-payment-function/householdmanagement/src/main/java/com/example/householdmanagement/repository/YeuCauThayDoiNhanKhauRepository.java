package com.example.householdmanagement.repository;

import com.example.householdmanagement.entity.YeuCauThayDoiNhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YeuCauThayDoiNhanKhauRepository extends JpaRepository<YeuCauThayDoiNhanKhau, Long> {
    List<YeuCauThayDoiNhanKhau> findByTrangThai(String trangThai);
    List<YeuCauThayDoiNhanKhau> findByTaiKhoan_MaTaiKhoan(Long maTaiKhoan);
    List<YeuCauThayDoiNhanKhau> findByTrangThaiOrderByNgayTaoDesc(String trangThai);
}






