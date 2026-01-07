package com.example.householdmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class LoaiPhiDTO {
    
    private Long maLoaiPhi;
    
    @NotBlank(message = "Tên loại phí không được để trống")
    private String tenLoaiPhi;
    
    private String moTa;
    
    @NotNull(message = "Bắt buộc không được để trống")
    private Boolean batBuoc;
    
    private BigDecimal dinhMuc;

    private BigDecimal mucTieu;

    public BigDecimal getMucTieu() {
        return mucTieu;
    }

    public void setMucTieu(BigDecimal mucTieu) {
        this.mucTieu = mucTieu;
    }

    // Constructors
    public LoaiPhiDTO() {}
    
    public LoaiPhiDTO(String tenLoaiPhi, Boolean batBuoc, BigDecimal dinhMuc) {
        this.tenLoaiPhi = tenLoaiPhi;
        this.batBuoc = batBuoc;
        this.dinhMuc = dinhMuc;
    }
    
    // Getters and Setters
    public Long getMaLoaiPhi() {
        return maLoaiPhi;
    }
    
    public void setMaLoaiPhi(Long maLoaiPhi) {
        this.maLoaiPhi = maLoaiPhi;
    }
    
    public String getTenLoaiPhi() {
        return tenLoaiPhi;
    }
    
    public void setTenLoaiPhi(String tenLoaiPhi) {
        this.tenLoaiPhi = tenLoaiPhi;
    }
    
    public String getMoTa() {
        return moTa;
    }
    
    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }
    
    public Boolean getBatBuoc() {
        return batBuoc;
    }
    
    public void setBatBuoc(Boolean batBuoc) {
        this.batBuoc = batBuoc;
    }
    
    public BigDecimal getDinhMuc() {
        return dinhMuc;
    }
    
    public void setDinhMuc(BigDecimal dinhMuc) {
        this.dinhMuc = dinhMuc;
    }
}
