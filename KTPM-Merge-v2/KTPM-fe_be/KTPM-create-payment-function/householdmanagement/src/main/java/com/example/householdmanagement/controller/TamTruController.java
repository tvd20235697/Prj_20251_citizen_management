package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.GiaHanTamTruRequest;
import com.example.householdmanagement.entity.TamTru;
import com.example.householdmanagement.service.NhanKhauService;
import com.example.householdmanagement.repository.TamTruRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tamtru")
public class TamTruController {

    @Autowired
    private NhanKhauService nhanKhauService;

    @Autowired
    private TamTruRepository tamTruRepository;

    @PostMapping("/{maTamTru}/giahan")
    public ResponseEntity<?> giaHanTamTru(@PathVariable Long maTamTru, @RequestBody GiaHanTamTruRequest request) {
        TamTru tamTru = tamTruRepository.findById(maTamTru)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tạm trú: " + maTamTru));

        if (tamTru.getTrangThai() == null) tamTru.setTrangThai("Dang tam tru");
        if ("Da ket thuc".equalsIgnoreCase(tamTru.getTrangThai())) {
            return ResponseEntity.status(409).body("Tạm trú đã kết thúc, không thể gia hạn");
        }

        if (request.getNewDenNgay() == null) {
            return ResponseEntity.badRequest().body("newDenNgay là bắt buộc");
        }

        LocalDateTime currentDen = tamTru.getDenNgay();
        LocalDateTime newDen = request.getNewDenNgay();

        if (!newDen.isAfter(currentDen)) {
            return ResponseEntity.badRequest().body("newDenNgay phải lớn hơn DenNgay hiện tại");
        }

        tamTru.setDenNgay(newDen);
        if (request.getLyDo() != null) tamTru.setLyDo(request.getLyDo());
        if (request.getGhiChu() != null) tamTru.setGhiChu(request.getGhiChu());
        tamTru.setTrangThai("Dang tam tru");

        TamTru saved = tamTruRepository.save(tamTru);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{maTamTru}/ketthuc")
    public ResponseEntity<?> ketThucTamTru(@PathVariable Long maTamTru) {
        TamTru tamTru = tamTruRepository.findById(maTamTru)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tạm trú: " + maTamTru));

        if (tamTru.getTrangThai() == null) tamTru.setTrangThai("Dang tam tru");
        if ("Da ket thuc".equalsIgnoreCase(tamTru.getTrangThai())) {
            return ResponseEntity.status(409).body("Tạm trú đã kết thúc");
        }

        LocalDateTime ngayKet = LocalDateTime.now();

        tamTru.setDenNgay(ngayKet);
        tamTru.setTrangThai("Da ket thuc");

        TamTru saved = tamTruRepository.save(tamTru);
        return ResponseEntity.ok(saved);
    }

    // GET list of TamTru with optional filters: trangThai, maNhanKhau, tuNgay & denNgay
    @GetMapping
    public ResponseEntity<?> layDanhSachTamTru(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) Long maNhanKhau,
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay
    ) {
        try {
            if (trangThai != null && !trangThai.isBlank()) {
                List<TamTru> list = tamTruRepository.findByTrangThai(trangThai);
                return ResponseEntity.ok(list);
            }

            if (maNhanKhau != null) {
                List<TamTru> list = tamTruRepository.findByNhanKhau_MaNhanKhau(maNhanKhau);
                return ResponseEntity.ok(list);
            }

            if (tuNgay != null && denNgay != null) {
                LocalDateTime tu = LocalDateTime.parse(tuNgay);
                LocalDateTime den = LocalDateTime.parse(denNgay);
                List<TamTru> list = tamTruRepository.findByThoiGianBetween(tu, den);
                return ResponseEntity.ok(list);
            }

            List<TamTru> all = tamTruRepository.findAll();
            return ResponseEntity.ok(all);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Invalid request: " + ex.getMessage());
        }
    }

    // New: search by resident name (q param), return list of maTamTru
    @GetMapping("/search")
    public ResponseEntity<?> searchByName(@RequestParam String q) {
        if (q == null || q.trim().length() < 1) {
            return ResponseEntity.badRequest().body("Query parameter 'q' is required and must have at least 1 character");
        }
        String query = q.trim();
        // call repository method
        List<Long> ids = tamTruRepository.findMaTamTruByNhanKhauHoTenContainingIgnoreCase(query);
        return ResponseEntity.ok(ids);
    }
}
