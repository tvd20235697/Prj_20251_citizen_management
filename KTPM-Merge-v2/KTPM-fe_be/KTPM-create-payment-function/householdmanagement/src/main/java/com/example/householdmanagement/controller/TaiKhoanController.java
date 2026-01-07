package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.TaiKhoanRequest;
import com.example.householdmanagement.dto.TaiKhoanResponse;
import com.example.householdmanagement.service.TaiKhoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taikhoan")
@CrossOrigin(origins = "*")
public class TaiKhoanController {

    private static final Logger logger = LoggerFactory.getLogger(TaiKhoanController.class);

    @Autowired
    private TaiKhoanService taiKhoanService;

    @GetMapping
    public ResponseEntity<List<TaiKhoanResponse>> layTatCa() {
        return ResponseEntity.ok(taiKhoanService.layTatCaTaiKhoan());
    }

    // Lấy tất cả tài khoản theo mã nhân khẩu (chủ hộ) - Phải đặt trước /{id}
    @GetMapping("/nhan-khau/{maNhanKhau}")
    public ResponseEntity<?> layTaiKhoanTheoNhanKhau(@PathVariable Long maNhanKhau) {
        try {
            List<TaiKhoanResponse> allAccounts = taiKhoanService.layTatCaTaiKhoan();
            List<TaiKhoanResponse> accounts = allAccounts.stream()
                    .filter(acc -> acc.getMaNhanKhau() != null && acc.getMaNhanKhau().equals(maNhanKhau))
                    .collect(java.util.stream.Collectors.toList());
            if (accounts.isEmpty()) {
                return ResponseEntity.ok(new java.util.ArrayList<>()); // Trả về danh sách rỗng
            }
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.error("Error fetching accounts for maNhanKhau {}: {}", maNhanKhau, e.getMessage());
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    // Lấy tài khoản theo số hộ khẩu (tìm chủ hộ của hộ khẩu đó) - Phải đặt trước /{id}
    @GetMapping("/ho-khau/{soHoKhau}")
    public ResponseEntity<?> layTaiKhoanTheoHoKhau(@PathVariable Long soHoKhau) {
        try {
            TaiKhoanResponse account = taiKhoanService.layTaiKhoanTheoSoHoKhau(soHoKhau);
            // Trả về account (có thể null) - Spring sẽ serialize null thành JSON null
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            // Nếu không tìm thấy chủ hộ hoặc tài khoản, trả về null
            if (e.getMessage() != null && 
                (e.getMessage().contains("Không tìm thấy") || e.getMessage().contains("không tìm thấy"))) {
                logger.debug("Account not found for soHoKhau {}: {}", soHoKhau, e.getMessage());
                return ResponseEntity.ok((TaiKhoanResponse) null);
            }
            logger.error("Error fetching account for soHoKhau {}: {}", soHoKhau, e.getMessage());
            return ResponseEntity.ok((TaiKhoanResponse) null);
        } catch (Exception e) {
            logger.error("Unexpected error fetching account for soHoKhau {}: ", soHoKhau, e);
            return ResponseEntity.ok((TaiKhoanResponse) null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaiKhoanResponse> layTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(taiKhoanService.layTaiKhoanTheoId(id));
    }

    @PostMapping
    public ResponseEntity<?> tao(@RequestBody TaiKhoanRequest req) {
        try {
            logger.info("Creating account with request: tenDangNhap={}, email={}, maNhanKhau={}, vaiTro={}", 
                    req.getTenDangNhap(), req.getEmail(), req.getMaNhanKhau(), req.getVaiTro());
            
            TaiKhoanResponse created = taiKhoanService.taoTaiKhoan(req);
            
            logger.info("Account created successfully: maTaiKhoan={}", created.getMaTaiKhoan());
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            logger.error("Error creating account: {}", e.getMessage(), e);
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating account: ", e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaiKhoanResponse> capNhat(@PathVariable Long id, @RequestBody TaiKhoanRequest req) {
        TaiKhoanResponse updated = taiKhoanService.capNhatTaiKhoan(id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        taiKhoanService.xoaTaiKhoan(id);
        return ResponseEntity.ok().build();
    }
}

