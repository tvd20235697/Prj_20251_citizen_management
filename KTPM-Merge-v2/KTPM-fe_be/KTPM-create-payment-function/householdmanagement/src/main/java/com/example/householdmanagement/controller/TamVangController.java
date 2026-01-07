package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.TamVangRequest;
import com.example.householdmanagement.entity.TamVang;
import com.example.householdmanagement.repository.TamVangRepository;
import com.example.householdmanagement.service.NhanKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tamvang")
@CrossOrigin(origins = "*")
public class TamVangController {

    @Autowired
    private TamVangRepository tamVangRepository;

    @Autowired
    private NhanKhauService nhanKhauService;

    @GetMapping
    public ResponseEntity<List<TamVang>> layTatCa() {
        List<TamVang> danhSach = tamVangRepository.findAll();
        return ResponseEntity.ok(danhSach);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TamVang> layTheoId(@PathVariable Long id) {
        return tamVangRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<TamVang>> layTheoTrangThai(@PathVariable String trangThai) {
        List<TamVang> danhSach = tamVangRepository.findByTrangThai(trangThai);
        return ResponseEntity.ok(danhSach);
    }

    @GetMapping("/nhan-khau/{maNhanKhau}")
    public ResponseEntity<List<TamVang>> layTheoNhanKhau(@PathVariable Long maNhanKhau) {
        List<TamVang> danhSach = tamVangRepository.findByNhanKhau_MaNhanKhau(maNhanKhau);
        return ResponseEntity.ok(danhSach);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhatTamVang(@PathVariable Long id, @RequestBody TamVangRequest request) {
        try {
            TamVang updated = nhanKhauService.capNhatTamVang(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/ket-thuc")
    public ResponseEntity<?> ketThucTamVang(@PathVariable Long id) {
        try {
            TamVang updated = nhanKhauService.ketThucTamVang(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

