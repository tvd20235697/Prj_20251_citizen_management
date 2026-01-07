package com.example.householdmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TamVangRequest {
    private Long maNhanKhau;
    private String noiDi;
    private LocalDateTime tuNgay;
    private LocalDateTime denNgay;
    private String lyDo;
    private String ghiChu;
}


