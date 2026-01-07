package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ThayDoiNhanKhauRequest {
    private Long maNhanKhau;
    private String loaiThayDoi; // "Chuyen di", "Qua doi", "Thay doi thong tin", "Cap nhat trang thai"
    private LocalDateTime ngayChuyenDi;
    private String noiChuyen;
    private String ghiChu;
    private String noiDungThayDoi;
    private String trangThai; // "Thuong tru", "Moi sinh", "Qua doi", "Chuyen di"
}


