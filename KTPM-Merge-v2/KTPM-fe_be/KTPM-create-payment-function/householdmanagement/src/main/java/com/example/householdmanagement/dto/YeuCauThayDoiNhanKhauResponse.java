package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class YeuCauThayDoiNhanKhauResponse {
    private Long maYeuCau;
    private Long maTaiKhoan;
    private String tenDangNhap; // Tên đăng nhập chủ hộ
    private String hoTenChuHo; // Họ tên chủ hộ
    private Long soHoKhau; // Số hộ khẩu
    private String loaiYeuCau; // "THEM", "SUA", "XOA"
    private String loaiYeuCauLabel; // "Thêm nhân khẩu", "Sửa nhân khẩu", "Xóa nhân khẩu"
    private Long maNhanKhau;
    private String duLieu; // JSON string
    private String trangThai; // "CHO_XAC_THUC", "DA_XAC_THUC", "TU_CHOI"
    private String trangThaiLabel; // "Chờ xác thực", "Đã xác thực", "Từ chối"
    private String ghiChu;
    private String lyDoTuChoi;
    private Long maCanBoXacThuc;
    private String tenCanBoXacThuc;
    private LocalDateTime ngayXacThuc;
    private LocalDateTime ngayTao;
}






