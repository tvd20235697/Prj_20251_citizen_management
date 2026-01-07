package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.TotalCollectedDto;
import com.example.householdmanagement.dto.UnpaidHouseholdDto;
import com.example.householdmanagement.dto.SanitationStatsDto;
import com.example.householdmanagement.service.FeeReportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class FeeReportController {
    private final FeeReportService feeReportService;

    public FeeReportController(FeeReportService feeReportService) {
        this.feeReportService = feeReportService;
    }

    // 1) Tổng số tiền đã thu cho 1 loại phí (theo maLoai)
    @GetMapping("/fees/{maLoai}/total")
    public ResponseEntity<TotalCollectedDto> getTotalCollected(@PathVariable Long maLoai) {
        TotalCollectedDto dto = feeReportService.getTotalCollectedByLoai(maLoai);
        return ResponseEntity.ok(dto);
    }

    // 2) Danh sách các hộ chưa đóng phí cho 1 loại phí (theo maLoai)
    @GetMapping("/fees/{maLoai}/unpaid-households")
    public ResponseEntity<List<UnpaidHouseholdDto>> getUnpaidHouseholds(@PathVariable Long maLoai) {
        List<UnpaidHouseholdDto> list = feeReportService.getUnpaidHouseholdsByLoai(maLoai);
        return ResponseEntity.ok(list);
    }

    // 3) Trả về tổng số người đóng phí vệ sinh và số hộ chưa đóng phí vệ sinh
    @GetMapping("/fees/sanitation/stats")
    public ResponseEntity<SanitationStatsDto> getSanitationStats() {
        SanitationStatsDto stats = feeReportService.getSanitationStats();
        return ResponseEntity.ok(stats);
    }

    // Optional: list unpaid households for sanitation
    @GetMapping("/fees/sanitation/unpaid-households")
    public ResponseEntity<List<UnpaidHouseholdDto>> getSanitationUnpaidHouseholds() {
        List<UnpaidHouseholdDto> list = feeReportService.getSanitationUnpaidHouseholds();
        return ResponseEntity.ok(list);
    }
}

