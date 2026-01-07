package com.example.householdmanagement.dto;

import lombok.Data;

@Data
public class ThayDoiChuHoRequest {
    private Long soHoKhau;

    private Long maNhanKhauMoi; // Nhân khẩu mới làm chủ hộ
    private String noiDungThayDoi;
    private String ghiChu;
}


