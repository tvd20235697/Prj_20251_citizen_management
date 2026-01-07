package com.example.householdmanagement.dto;

import lombok.Data;

@Data
public class YeuCauThayDoiNhanKhauRequest {
    private Long maTaiKhoan; // Tài khoản chủ hộ gửi yêu cầu
    private String loaiYeuCau; // "THEM", "SUA", "XOA"
    private Long maNhanKhau; // Mã nhân khẩu (null nếu thêm mới)
    private String duLieu; // JSON string chứa dữ liệu nhân khẩu
    private String ghiChu; // Ghi chú từ chủ hộ
}






