package com.example.householdmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DotThuDTO {

    private Long maDotThu;

    @NotNull(message = "Mã loại phí không được để trống")
    private Long maLoai;

    @NotBlank(message = "Tên đợt thu không được để trống")
    private String tenDotThu;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime ngayBatDau;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime ngayKetThuc;

    // ===== Constructors =====
    public DotThuDTO() {}

    public DotThuDTO(Long maLoai, String tenDotThu,
                     LocalDateTime ngayBatDau,
                     LocalDateTime ngayKetThuc) {
        this.maLoai = maLoai;
        this.tenDotThu = tenDotThu;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
    }

    // ===== Getters & Setters =====
    public Long getMaDotThu() {
        return maDotThu;
    }

    public void setMaDotThu(Long maDotThu) {
        this.maDotThu = maDotThu;
    }

    public Long getMaLoai() {
        return maLoai;
    }

    public void setMaLoai(Long maLoai) {
        this.maLoai = maLoai;
    }

    public String getTenDotThu() {
        return tenDotThu;
    }

    public void setTenDotThu(String tenDotThu) {
        this.tenDotThu = tenDotThu;
    }

    public LocalDateTime getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDateTime ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDateTime getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDateTime ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }
}
