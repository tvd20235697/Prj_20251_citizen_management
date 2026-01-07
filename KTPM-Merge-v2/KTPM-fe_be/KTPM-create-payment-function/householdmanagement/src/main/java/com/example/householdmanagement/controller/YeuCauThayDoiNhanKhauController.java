package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.*;
import com.example.householdmanagement.service.YeuCauThayDoiNhanKhauService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yeucau")
@CrossOrigin(origins = "*")
public class YeuCauThayDoiNhanKhauController {

    private static final Logger logger = LoggerFactory.getLogger(YeuCauThayDoiNhanKhauController.class);

    @Autowired
    private YeuCauThayDoiNhanKhauService yeuCauService;

    // User: Tạo yêu cầu
    @PostMapping
    public ResponseEntity<?> taoYeuCau(@RequestBody YeuCauThayDoiNhanKhauRequest req) {
        try {
            logger.info("Creating request: type={}, maTaiKhoan={}", req.getLoaiYeuCau(), req.getMaTaiKhoan());
            YeuCauThayDoiNhanKhauResponse response = yeuCauService.taoYeuCau(req);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error creating request: {}", e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error: ", e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // User: Lấy yêu cầu của mình
    @GetMapping("/tai-khoan/{maTaiKhoan}")
    public ResponseEntity<List<YeuCauThayDoiNhanKhauResponse>> layYeuCauTheoTaiKhoan(@PathVariable Long maTaiKhoan) {
        try {
            List<YeuCauThayDoiNhanKhauResponse> yeuCauList = yeuCauService.layYeuCauTheoTaiKhoan(maTaiKhoan);
            return ResponseEntity.ok(yeuCauList);
        } catch (Exception e) {
            logger.error("Error fetching requests: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    // Admin: Lấy yêu cầu theo trạng thái
    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<YeuCauThayDoiNhanKhauResponse>> layYeuCauTheoTrangThai(@PathVariable String trangThai) {
        try {
            List<YeuCauThayDoiNhanKhauResponse> yeuCauList = yeuCauService.layYeuCauTheoTrangThai(trangThai);
            return ResponseEntity.ok(yeuCauList);
        } catch (Exception e) {
            logger.error("Error fetching requests: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    // Admin: Xác thực yêu cầu
    @PostMapping("/xac-thuc")
    public ResponseEntity<?> xacThucYeuCau(@RequestBody XacThucYeuCauRequest req) {
        try {
            logger.info("Processing request: maYeuCau={}, hanhDong={}, maCanBo={}", 
                    req.getMaYeuCau(), req.getHanhDong(), req.getMaCanBo());
            YeuCauThayDoiNhanKhauResponse response = yeuCauService.xacThucYeuCau(req);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error processing request: {}", e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error: ", e);
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}






