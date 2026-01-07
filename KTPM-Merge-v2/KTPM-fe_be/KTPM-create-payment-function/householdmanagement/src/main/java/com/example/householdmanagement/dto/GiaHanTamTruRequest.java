package com.example.householdmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GiaHanTamTruRequest {
    private LocalDateTime newDenNgay;
    private String lyDo;
    private String ghiChu;
}

