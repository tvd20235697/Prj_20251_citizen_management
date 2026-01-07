package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TamTruRequest {
    private Long maNhanKhau;
    private String noiTamTru;
    private LocalDateTime tuNgay;
    private LocalDateTime denNgay;
    private String lyDo;
    private String ghiChu;
}


