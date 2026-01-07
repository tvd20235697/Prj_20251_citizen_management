package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.HoKhauDTO;
import com.example.householdmanagement.dto.CapNhatHoKhauRequest;
import com.example.householdmanagement.dto.TaoHoKhauRequest;
import com.example.householdmanagement.entity.HoKhau;
import com.example.householdmanagement.entity.NhanKhau;
import com.example.householdmanagement.repository.HoKhauRepository;
import com.example.householdmanagement.service.HoKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hokhau")
@CrossOrigin(origins = "*")
public class HoKhauController {

    @Autowired
    private HoKhauService hoKhauService;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @GetMapping("/{soHoKhau}")
    public ResponseEntity<HoKhauDTO> layHoKhauTheoSoHoKhau(@PathVariable Long soHoKhau) {
        try {
            HoKhau hoKhau = hoKhauService.layHoKhauTheoSoHoKhau(soHoKhau);
            HoKhauDTO dto = toDto(hoKhau);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<HoKhauDTO>> layTatCaHoKhau() {
        try {
            List<HoKhau> hoKhauList = hoKhauService.layTatCaHoKhau();
            // Lọc và chỉ trả về các hộ khẩu thực sự tồn tại (validate bằng existsById)
            List<HoKhauDTO> dtos = hoKhauList.stream()
                    .filter(hk -> {
                        if (hk == null || hk.getSoHoKhau() == null) {
                            return false;
                        }
                        // Validate hộ khẩu có thực sự tồn tại trong database
                        boolean exists = hoKhauRepository.existsById(hk.getSoHoKhau());
                        if (!exists) {
                            System.out.println("WARNING: Hộ khẩu " + hk.getSoHoKhau() + " không tồn tại trong database, bỏ qua");
                        }
                        return exists;
                    })
                    .map(this::toDto)
                    .filter(dto -> dto != null && dto.getSoHoKhau() != null)
                    .collect(Collectors.toList());
            System.out.println("DEBUG: Trả về " + dtos.size() + " hộ khẩu hợp lệ từ " + hoKhauList.size() + " hộ khẩu");
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("ERROR in layTatCaHoKhau: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private HoKhauDTO toDto(HoKhau hoKhau) {
        HoKhauDTO dto = new HoKhauDTO();
        dto.setSoHoKhau(hoKhau.getSoHoKhau());
        dto.setDiaChi(hoKhau.getDiaChi());
        dto.setNgayCap(hoKhau.getNgayCap());
        dto.setGhiChu(hoKhau.getGhiChu());
        
        if (hoKhau.getXaPhuong() != null) {
            dto.setMaXaPhuong(hoKhau.getXaPhuong().getMaXaPhuong());
            dto.setTenXaPhuong(hoKhau.getXaPhuong().getTenXaPhuong());
        }
        
        // Đếm số nhân khẩu
        Long soNhanKhau = hoKhauService.demSoNhanKhau(hoKhau.getSoHoKhau());
        dto.setSoNhanKhau(soNhanKhau);
        
        // Lấy thông tin chủ hộ
        NhanKhau chuHo = hoKhauService.layChuHo(hoKhau.getSoHoKhau());
        if (chuHo != null) {
            dto.setChuHo(chuHo.getHoTen());
            dto.setMaNhanKhauChuHo(chuHo.getMaNhanKhau());
            System.out.println("DEBUG: Tìm thấy chủ hộ cho hộ khẩu " + hoKhau.getSoHoKhau() + 
                ": " + chuHo.getHoTen() + " (quanHeVoiChuHo: " + chuHo.getQuanHeVoiChuHo() + ")");
        } else {
            System.out.println("DEBUG: Không tìm thấy chủ hộ cho hộ khẩu " + hoKhau.getSoHoKhau());
            // Đặt giá trị mặc định để frontend biết là chưa có chủ hộ
            dto.setChuHo(null);
        }
        
        return dto;
    }

    @PutMapping("/{soHoKhau}")
    public ResponseEntity<?> capNhatHoKhau(
            @PathVariable Long soHoKhau,
            @RequestBody CapNhatHoKhauRequest request) {
        try {
            System.out.println("DEBUG: Cập nhật hộ khẩu " + soHoKhau + " với dữ liệu: " + request);
            HoKhau hoKhau = hoKhauService.capNhatHoKhau(
                    soHoKhau,
                    request.getDiaChi(),
                    request.getMaXaPhuong(),
                    request.getGhiChu()
            );
            HoKhauDTO dto = toDto(hoKhau);
            System.out.println("DEBUG: Cập nhật thành công hộ khẩu " + soHoKhau);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> taoHoKhau(@RequestBody TaoHoKhauRequest request) {
        try {
            System.out.println("DEBUG: Controller - Nhận request tạo hộ khẩu mới");
            System.out.println("DEBUG: Controller - Dữ liệu: soHoKhau=" + request.getSoHoKhau() + 
                ", diaChi=" + request.getDiaChi() + 
                ", maXaPhuong=" + request.getMaXaPhuong() + 
                ", maNhanKhauChuHo=" + request.getMaNhanKhauChuHo());
            
            if (request.getSoHoKhau() == null) {
                throw new RuntimeException("Số hộ khẩu không được để trống");
            }
            if (request.getDiaChi() == null || request.getDiaChi().trim().isEmpty()) {
                throw new RuntimeException("Địa chỉ không được để trống");
            }
            if (request.getMaXaPhuong() == null) {
                throw new RuntimeException("Mã xã phường không được để trống");
            }
            
            HoKhau hoKhau = hoKhauService.taoHoKhau(
                    request.getSoHoKhau(),
                    request.getDiaChi(),
                    request.getMaXaPhuong(),
                    request.getGhiChu(),
                    request.getMaNhanKhauChuHo()
            );
            HoKhauDTO dto = toDto(hoKhau);
            System.out.println("DEBUG: Controller - Tạo hộ khẩu thành công: " + hoKhau.getSoHoKhau());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    @DeleteMapping("/{soHoKhau}")
    public ResponseEntity<?> xoaHoKhau(@PathVariable Long soHoKhau) {
        try {
            hoKhauService.xoaHoKhau(soHoKhau);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("Không tìm thấy")) {
                return ResponseEntity.status(404).body(errorMsg);
            }
            return ResponseEntity.badRequest().body(errorMsg);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }
}






