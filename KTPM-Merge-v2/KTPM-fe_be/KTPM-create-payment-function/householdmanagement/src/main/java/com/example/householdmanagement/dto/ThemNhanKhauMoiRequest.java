package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ThemNhanKhauMoiRequest {
    private Long soHoKhau;
    private String hoTen;
    private String gioiTinh;
    private LocalDateTime ngaySinh;
    private String quanHeVoiChuHo;
    private String ngheNghiep; // thêm để có thể lưu nghề nghiệp khi tạo
    private String trangThai; // "Moi sinh", "Thuong tru", "Qua doi", "Chuyen di"
}
