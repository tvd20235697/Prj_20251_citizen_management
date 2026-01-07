package com.example.householdmanagement.dto;

import lombok.Data;

@Data
public class TaiKhoanRequest {
    private Long maCanBo;
    private Long maNhanKhau;
    private String tenDangNhap;
    private String matKhau;
    private String vaiTro;
    private String email;
    private String trangThai; // e.g., DANG_HOAT_DONG
}

