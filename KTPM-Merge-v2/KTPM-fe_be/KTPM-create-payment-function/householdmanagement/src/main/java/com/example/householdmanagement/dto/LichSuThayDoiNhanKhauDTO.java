package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LichSuThayDoiNhanKhauDTO {
    private Long maLichSuThayDoi;
    private Long maNhanKhau;
    private String hoTen;
    private String loaiThayDoi;
    private String noiDungThayDoi;
    private LocalDateTime ngayChuyenDi;
    private String noiChuyen;
    private LocalDateTime ngayThayDoi;
    private String ghiChu;
}




















