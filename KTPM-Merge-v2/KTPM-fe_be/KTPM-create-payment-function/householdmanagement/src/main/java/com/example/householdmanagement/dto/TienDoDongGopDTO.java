package com.example.householdmanagement.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TienDoDongGopDTO {

    private Long maLoaiPhi;
    private String tenLoaiPhi;
    private BigDecimal dinhMuc;
    private BigDecimal mucTieu;
    private BigDecimal tongDaDong;
    private BigDecimal tiLeHoanThanh;

    public TienDoDongGopDTO(
            Long maLoaiPhi,
            String tenLoaiPhi,
            BigDecimal dinhMuc,
            BigDecimal mucTieu,
            BigDecimal tongDaDong,
            BigDecimal tiLeHoanThanh
    ) {
        this.maLoaiPhi = maLoaiPhi;
        this.tenLoaiPhi = tenLoaiPhi;
        this.dinhMuc = dinhMuc;
        this.mucTieu = mucTieu;
        this.tongDaDong = tongDaDong;
        this.tiLeHoanThanh = tiLeHoanThanh;
    }
}


