package com.example.householdmanagement.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HoDongGopDTO {

    private Long soHoKhau;
    private String diaChi;
    private String tenXaPhuong;
    private BigDecimal soTien;

    //  CONSTRUCTOR BẮT BUỘC CHO JPQL "new DTO(...)"
    public HoDongGopDTO(Long soHoKhau,
                        String diaChi,
                        String tenXaPhuong,
                        BigDecimal soTien) {
        this.soHoKhau = soHoKhau;
        this.diaChi = diaChi;
        this.tenXaPhuong = tenXaPhuong;
        this.soTien = soTien;
    }
}
