package com.example.householdmanagement.dto;

import lombok.Data;
import java.util.List;

@Data
public class TachHoRequest {
    private Long soHoKhauGoc;
    private List<Long> danhSachMaNhanKhau; // Danh sách nhân khẩu tách ra
    private String diaChiMoi;
    private Long maXaPhuong;
    private String ghiChu;
}


