package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HoKhauDTO {
    private Long soHoKhau;
    private String diaChi;
    private LocalDateTime ngayCap;
    private String ghiChu;
    private Long maXaPhuong;
    private String tenXaPhuong;
    private Long soNhanKhau;
    private String chuHo; // Tên chủ hộ
    private Long maNhanKhauChuHo; // Mã nhân khẩu chủ hộ
}






