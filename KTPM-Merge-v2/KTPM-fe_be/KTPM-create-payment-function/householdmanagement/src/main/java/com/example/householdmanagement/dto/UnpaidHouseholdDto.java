package com.example.householdmanagement.dto;

import java.math.BigDecimal;

public class UnpaidHouseholdDto {
    private Long soHoKhau;
    private String diaChi;
    private String tenXaPhuong;
    private BigDecimal amountPaid;
    private BigDecimal amountDue;

    public UnpaidHouseholdDto() {}

    public UnpaidHouseholdDto(Long soHoKhau, String diaChi, String tenXaPhuong) {
        this.soHoKhau = soHoKhau;
        this.diaChi = diaChi;
        this.tenXaPhuong = tenXaPhuong;
        this.amountPaid = BigDecimal.ZERO;
        this.amountDue = BigDecimal.ZERO;
    }

    // Constructor used by repository JPQL:
    // (soHoKhau, diaChi, tenXaPhuong, amountPaid, dinhMuc, personCount)
    public UnpaidHouseholdDto(Long soHoKhau, String diaChi, String tenXaPhuong,
                              BigDecimal amountPaid, BigDecimal dinhMuc, Long personCount) {
        this.soHoKhau = soHoKhau;
        this.diaChi = diaChi;
        this.tenXaPhuong = tenXaPhuong;
        this.amountPaid = amountPaid == null ? BigDecimal.ZERO : amountPaid;
        BigDecimal people = BigDecimal.valueOf(personCount == null ? 0L : personCount);
        this.amountDue = (dinhMuc == null ? BigDecimal.ZERO : dinhMuc).multiply(people);
    }

    public Long getSoHoKhau() {
        return soHoKhau;
    }

    public void setSoHoKhau(Long soHoKhau) {
        this.soHoKhau = soHoKhau;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getTenXaPhuong() {
        return tenXaPhuong;
    }

    public void setTenXaPhuong(String tenXaPhuong) {
        this.tenXaPhuong = tenXaPhuong;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public BigDecimal getAmountDue() {
        return amountDue;
    }

    public void setAmountDue(BigDecimal amountDue) {
        this.amountDue = amountDue;
    }
}
