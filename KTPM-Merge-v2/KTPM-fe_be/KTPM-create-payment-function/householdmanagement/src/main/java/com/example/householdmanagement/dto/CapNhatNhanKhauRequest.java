package com.example.householdmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CapNhatNhanKhauRequest {
    private Long maNhanKhau;
    private String hoTen;
    private String gioiTinh;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime ngaySinh;
    private String cmnd;
    private String ngheNghiep;
    private String quanHeVoiChuHo;
    private String trangThai;
}

