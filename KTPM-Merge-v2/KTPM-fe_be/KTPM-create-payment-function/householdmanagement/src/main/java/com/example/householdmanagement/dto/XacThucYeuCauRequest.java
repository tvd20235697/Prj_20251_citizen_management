package com.example.householdmanagement.dto;

import lombok.Data;

@Data
public class XacThucYeuCauRequest {
    private Long maYeuCau;
    private Long maCanBo; // Cán bộ xác thực
    private String hanhDong; // "XAC_THUC" hoặc "TU_CHOI"
    private String lyDoTuChoi; // Lý do từ chối (nếu có)
}






