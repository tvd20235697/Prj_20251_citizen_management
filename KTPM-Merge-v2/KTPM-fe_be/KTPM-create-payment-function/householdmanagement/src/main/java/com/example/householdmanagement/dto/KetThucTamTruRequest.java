package com.example.householdmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class KetThucTamTruRequest {
    private LocalDateTime ngayKetThuc; // optional, default = now
    private String lyDo;
    private String ghiChu;
}

