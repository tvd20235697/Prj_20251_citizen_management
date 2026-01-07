package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.HoDongGopDTO;
import com.example.householdmanagement.dto.TienDoDongGopDTO;
import com.example.householdmanagement.service.DongGopThongKeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dong-gop")
@RequiredArgsConstructor
public class DongGopThongKeController {

    private final DongGopThongKeService service;

    // Tiến độ đóng góp từng loại phí
    @GetMapping("/tien-do")
    public ResponseEntity<List<TienDoDongGopDTO>> thongKeTienDo() {
        return ResponseEntity.ok(service.thongKeTienDoDongGop());
    }

    // Danh sách hộ đã đóng theo loại phí
    @GetMapping("/{maLoaiPhi}/ho-da-dong")
    public ResponseEntity<List<HoDongGopDTO>> hoDaDong(@PathVariable Long maLoaiPhi) {
        return ResponseEntity.ok(service.danhSachHoDaDong(maLoaiPhi));
    }
}
