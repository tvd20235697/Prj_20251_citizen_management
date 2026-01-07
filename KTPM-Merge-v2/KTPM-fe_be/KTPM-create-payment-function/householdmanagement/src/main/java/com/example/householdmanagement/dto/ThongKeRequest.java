package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ThongKeRequest {
    private String loaiThongKe; // "GioiTinh", "DoTuoi", "ThoiGian", "TamVang", "TamTru"
    private LocalDateTime tuNgay;
    private LocalDateTime denNgay;
    private String gioiTinh; // Cho thống kê theo giới tính
    private String doTuoi; // Cho thống kê theo độ tuổi
}


