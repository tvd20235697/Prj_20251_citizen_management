package com.example.householdmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NhanKhauDTO {
    private Long maNhanKhau;
    private Long soHoKhau;
    private String hoTen;
    private String gioiTinh;
    private LocalDateTime ngaySinh;
    private String cmnd;
    private String quanHeVoiChuHo;
    private String trangThai;
    private String ngheNghiep;
}
