package com.example.householdmanagement.dto;

import java.math.BigDecimal;

public class PhiVeSinhHouseholdDTO {

    private Long soHoKhau;
    private String diaChi;
    private String tenXaPhuong;
    private BigDecimal soTien;
    private String trangThai; // DA_DONG / CHUA_DONG

    public PhiVeSinhHouseholdDTO(Long soHoKhau,
                                 String diaChi,
                                 String tenXaPhuong,
                                 BigDecimal soTien,
                                 String trangThai) {
        this.soHoKhau = soHoKhau;
        this.diaChi = diaChi;
        this.tenXaPhuong = tenXaPhuong;
        this.soTien = soTien;
        this.trangThai = trangThai;
    }

    public Long getSoHoKhau() {
        return soHoKhau;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public String getTenXaPhuong() {
        return tenXaPhuong;
    }

    public BigDecimal getSoTien() {
        return soTien;
    }

    public String getTrangThai() {
        return trangThai;
    }
}
