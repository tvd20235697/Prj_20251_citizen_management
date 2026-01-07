package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.HoDongGopDTO;
import com.example.householdmanagement.dto.TienDoDongGopDTO;
import com.example.householdmanagement.repository.DongGopThongKeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DongGopThongKeService {

    private final DongGopThongKeRepository repository;

    public DongGopThongKeService(DongGopThongKeRepository repository) {
        this.repository = repository;
    }

    // THỐNG KÊ TIẾN ĐỘ ĐÓNG GÓP (so với mục tiêu)
    public List<TienDoDongGopDTO> thongKeTienDoDongGop() {
        return repository.thongKeTienDoDongGop();
    }

    //  DANH SÁCH HỘ ĐÃ ĐÓNG THEO LOẠI PHÍ
    public List<HoDongGopDTO> danhSachHoDaDong(Long maLoaiPhi) {
        return repository.danhSachHoDaDong(maLoaiPhi);
    }
}
