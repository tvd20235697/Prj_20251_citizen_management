package com.example.householdmanagement.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ThuPhiDTO {
    
    private Long maThuPhi;
    
    @NotNull(message = "Số hộ khẩu không được để trống")
    private Long soHoKhau;
    
    @NotNull(message = "Mã đợt thu không được để trống")
    private Long maDotThu;


    
    @NotNull(message = "Số tiền không được để trống")
    private BigDecimal soTien;
    
    @NotNull(message = "Ngày đóng không được để trống")
    private LocalDateTime ngayDong;
    
    private String ghiChu;
    
    // Thông tin hiển thị (không lưu DB)
    private String tenHoKhau;
    private String tenDotThu;
    private String tenLoaiPhi;
    
    // Constructors
    public ThuPhiDTO() {}
    
    public ThuPhiDTO(Long soHoKhau, Long maDotThu, Long maLoai, BigDecimal soTien, LocalDateTime ngayDong) {
        this.soHoKhau = soHoKhau;
        this.maDotThu = maDotThu;
        this.soTien = soTien;
        this.ngayDong = ngayDong;
    }
    
    // Getters and Setters
    public Long getMaThuPhi() {
        return maThuPhi;
    }
    
    public void setMaThuPhi(Long maThuPhi) {
        this.maThuPhi = maThuPhi;
    }
    
    public Long getSoHoKhau() {
        return soHoKhau;
    }
    
    public void setSoHoKhau(Long soHoKhau) {
        this.soHoKhau = soHoKhau;
    }
    
    public Long getMaDotThu() {
        return maDotThu;
    }
    
    public void setMaDotThu(Long maDotThu) {
        this.maDotThu = maDotThu;
    }

    
    public BigDecimal getSoTien() {
        return soTien;
    }
    
    public void setSoTien(BigDecimal soTien) {
        this.soTien = soTien;
    }
    
    public LocalDateTime getNgayDong() {
        return ngayDong;
    }
    
    public void setNgayDong(LocalDateTime ngayDong) {
        this.ngayDong = ngayDong;
    }
    
    public String getGhiChu() {
        return ghiChu;
    }
    
    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
    
    public String getTenHoKhau() {
        return tenHoKhau;
    }
    
    public void setTenHoKhau(String tenHoKhau) {
        this.tenHoKhau = tenHoKhau;
    }
    
    public String getTenDotThu() {
        return tenDotThu;
    }
    
    public void setTenDotThu(String tenDotThu) {
        this.tenDotThu = tenDotThu;
    }
    
    public String getTenLoaiPhi() {
        return tenLoaiPhi;
    }
    
    public void setTenLoaiPhi(String tenLoaiPhi) {
        this.tenLoaiPhi = tenLoaiPhi;
    }
}
