package com.example.householdmanagement.dto;

import lombok.Data;

@Data
public class TaiKhoanResponse {
    private Long maTaiKhoan;
    private Long maCanBo;
    private Long maNhanKhau;
    private String tenDangNhap;
    private String vaiTro;
    private String email;
    private String trangThai;
    private String hoTen; // Tên từ CanBo hoặc NhanKhau
    private Long soHoKhau; // Số hộ khẩu nếu là User
}

