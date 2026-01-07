package com.example.householdmanagement.dto;

import java.math.BigDecimal;

public class TotalCollectedDto {
    private Long maLoai;
    private BigDecimal totalCollected;

    public TotalCollectedDto() {}

    public TotalCollectedDto(Long maLoai, BigDecimal totalCollected) {
        this.maLoai = maLoai;
        this.totalCollected = totalCollected;
    }

    public Long getMaLoai() {
        return maLoai;
    }

    public void setMaLoai(Long maLoai) {
        this.maLoai = maLoai;
    }

    public BigDecimal getTotalCollected() {
        return totalCollected;
    }

    public void setTotalCollected(BigDecimal totalCollected) {
        this.totalCollected = totalCollected;
    }
}

