package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.PhiVeSinhHouseholdDTO;
import com.example.householdmanagement.service.PhiVeSinhService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/phi-ve-sinh")
@CrossOrigin
public class PhiVeSinhController {

    private final PhiVeSinhService phiVeSinhService;

    public PhiVeSinhController(PhiVeSinhService phiVeSinhService) {
        this.phiVeSinhService = phiVeSinhService;
    }

    // ✅ Danh sách hộ ĐÃ đóng phí vệ sinh theo năm
    @GetMapping("/{nam}/da-dong")
    public ResponseEntity<List<PhiVeSinhHouseholdDTO>> getDaDong(
            @PathVariable int nam
    ) {
        return ResponseEntity.ok(phiVeSinhService.getHouseholdsDaDong(nam));
    }

    // ✅ Danh sách hộ CHƯA đóng phí vệ sinh theo năm
    @GetMapping("/{nam}/chua-dong")
    public ResponseEntity<List<PhiVeSinhHouseholdDTO>> getChuaDong(
            @PathVariable int nam
    ) {
        return ResponseEntity.ok(phiVeSinhService.getHouseholdsChuaDong(nam));
    }

    // ✅ Thống kê
    @GetMapping("/{nam}/thong-ke")
    public ResponseEntity<Map<String, Object>> thongKe(
            @PathVariable int nam
    ) {
        return ResponseEntity.ok(phiVeSinhService.thongKePhiVeSinh(nam));
    }
}
