package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.ChangePasswordRequest;
import com.example.householdmanagement.dto.LoginRequest;
import com.example.householdmanagement.dto.TaiKhoanResponse;
import com.example.householdmanagement.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private TaiKhoanService taiKhoanService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt: {}", request.getTenDangNhapHoacEmail());
            TaiKhoanResponse response = taiKhoanService.timTaiKhoanDangNhap(
                    request.getTenDangNhapHoacEmail(),
                    request.getMatKhau()
            );
            logger.info("Login successful for: {}", request.getTenDangNhapHoacEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.warn("Login failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<TaiKhoanResponse> getCurrentUser(@RequestParam Long maTaiKhoan) {
        try {
            TaiKhoanResponse response = taiKhoanService.layTaiKhoanTheoId(maTaiKhoan);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thay đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            logger.info("Change password request for account: {}", request.getMaTaiKhoan());
            
            if (request.getMaTaiKhoan() == null) {
                return ResponseEntity.badRequest().body("Mã tài khoản không được để trống");
            }
            if (request.getMatKhauHienTai() == null || request.getMatKhauHienTai().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu hiện tại không được để trống");
            }
            if (request.getMatKhauMoi() == null || request.getMatKhauMoi().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu mới không được để trống");
            }
            if (request.getMatKhauMoi().length() < 6) {
                return ResponseEntity.badRequest().body("Mật khẩu mới phải có ít nhất 6 ký tự");
            }
            
            taiKhoanService.thayDoiMatKhau(
                    request.getMaTaiKhoan(),
                    request.getMatKhauHienTai(),
                    request.getMatKhauMoi()
            );
            
            logger.info("Password changed successfully for account: {}", request.getMaTaiKhoan());
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (RuntimeException e) {
            logger.warn("Change password failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Change password error: ", e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // Endpoint debug để kiểm tra tài khoản
    @GetMapping("/debug/accounts")
    public ResponseEntity<?> getAllAccounts() {
        try {
            return ResponseEntity.ok(taiKhoanService.layTatCaTaiKhoan());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }
}

