package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.*;
import com.example.householdmanagement.entity.*;
import com.example.householdmanagement.service.NhanKhauService;
import com.example.householdmanagement.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nhankhau")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.PATCH}, allowedHeaders = "*")
public class NhanKhauController {

    @Autowired
    private NhanKhauService nhanKhauService;

    @Autowired
    private ThongKeService thongKeService;

    // Thêm nhân khẩu mới (trẻ mới sinh)
    @PostMapping("/them-moi")
    public ResponseEntity<NhanKhau> themNhanKhauMoi(@RequestBody ThemNhanKhauMoiRequest request) {
        try {
            NhanKhau nhanKhau = nhanKhauService.themNhanKhauMoi(request);
            return ResponseEntity.ok(nhanKhau);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thay đổi nhân khẩu (chuyển đi, qua đời)
    @PutMapping("/thay-doi")
    public ResponseEntity<NhanKhau> thayDoiNhanKhau(@RequestBody ThayDoiNhanKhauRequest request) {
        try {
            NhanKhau nhanKhau = nhanKhauService.thayDoiNhanKhau(request);
            return ResponseEntity.ok(nhanKhau);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thay đổi chủ hộ
    @PutMapping("/thay-doi-chu-ho")
    public ResponseEntity<HoKhau> thayDoiChuHo(@RequestBody ThayDoiChuHoRequest request) {
        try {
            HoKhau hoKhau = nhanKhauService.thayDoiChuHo(request);
            return ResponseEntity.ok(hoKhau);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Tách hộ khẩu
    @PostMapping("/tach-ho")
    public ResponseEntity<HoKhau> tachHo(@RequestBody TachHoRequest request) {
        try {
            HoKhau hoKhauMoi = nhanKhauService.tachHo(request);
            return ResponseEntity.ok(hoKhauMoi);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thêm tạm vắng
    @PostMapping("/tam-vang")
    public ResponseEntity<TamVang> themTamVang(@RequestBody TamVangRequest request) {
        try {
            TamVang tamVang = nhanKhauService.themTamVang(request);
            return ResponseEntity.ok(tamVang);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thêm tạm trú
    @PostMapping("/tam-tru")
    public ResponseEntity<TamTru> themTamTru(@RequestBody TamTruRequest request) {
        try {
            TamTru tamTru = nhanKhauService.themTamTru(request);
            return ResponseEntity.ok(tamTru);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Tìm kiếm nhân khẩu
    @PostMapping("/tim-kiem")
    public ResponseEntity<List<NhanKhau>> timKiemNhanKhau(@RequestBody TimKiemRequest request) {
        try {
            List<NhanKhau> ketQua = nhanKhauService.timKiemNhanKhau(request);
            return ResponseEntity.ok(ketQua);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== LỊCH SỬ THAY ĐỔI NHÂN KHẨU ==========
    // Xem tất cả lịch sử thay đổi nhân khẩu
    @GetMapping(value = "/lich-su-nhan-khau", produces = "application/json")
    public ResponseEntity<List<LichSuThayDoiNhanKhauDTO>> xemTatCaLichSuThayDoiNhanKhau() {
        System.out.println("========== API /lich-su-nhan-khau CALLED ==========");
        try {
            List<LichSuThayDoiNhanKhauDTO> lichSu = nhanKhauService.xemTatCaLichSuThayDoiNhanKhau();
            System.out.println("Returning " + (lichSu != null ? lichSu.size() : 0) + " records");
            return ResponseEntity.ok(lichSu != null ? lichSu : new java.util.ArrayList<>());
        } catch (Exception e) {
            System.err.println("ERROR in xemTatCaLichSuThayDoiNhanKhau: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Xem lịch sử thay đổi nhân khẩu của một hộ (theo số hộ khẩu)
    @GetMapping("/lich-su-nhan-khau/ho-khau/{soHoKhau}")
    public ResponseEntity<List<LichSuThayDoiNhanKhauDTO>> xemLichSuThayDoiNhanKhauTheoHoKhau(@PathVariable Long soHoKhau) {
        try {
            List<LichSuThayDoiNhanKhauDTO> lichSu = nhanKhauService.xemLichSuThayDoiNhanKhau(soHoKhau);
            return ResponseEntity.ok(lichSu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Xem lịch sử thay đổi nhân khẩu theo mã nhân khẩu
    @GetMapping("/lich-su-nhan-khau/ma/{maNhanKhau}")
    public ResponseEntity<List<LichSuThayDoiNhanKhauDTO>> xemLichSuThayDoiNhanKhauTheoMa(@PathVariable Long maNhanKhau) {
        System.out.println("========== API /lich-su-nhan-khau/ma/" + maNhanKhau + " CALLED ==========");
        try {
            List<LichSuThayDoiNhanKhauDTO> lichSu = nhanKhauService.xemLichSuThayDoiNhanKhauTheoMa(maNhanKhau);
            System.out.println("Returning " + (lichSu != null ? lichSu.size() : 0) + " records for maNhanKhau: " + maNhanKhau);
            return ResponseEntity.ok(lichSu != null ? lichSu : new java.util.ArrayList<>());
        } catch (Exception e) {
            System.err.println("ERROR in xemLichSuThayDoiNhanKhauTheoMa: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ========== LỊCH SỬ THAY ĐỔI HỘ KHẨU ==========
    // Xem tất cả lịch sử thay đổi hộ khẩu
    @GetMapping(value = "/lich-su-ho-khau", produces = "application/json")
    public ResponseEntity<List<LichSuThayDoiHoKhau>> xemTatCaLichSuThayDoiHoKhau() {
        System.out.println("========== API /lich-su-ho-khau CALLED ==========");
        try {
            List<LichSuThayDoiHoKhau> lichSu = nhanKhauService.xemTatCaLichSuThayDoiHoKhau();
            System.out.println("Returning " + (lichSu != null ? lichSu.size() : 0) + " records");
            return ResponseEntity.ok(lichSu != null ? lichSu : new java.util.ArrayList<>());
        } catch (Exception e) {
            System.err.println("ERROR in xemTatCaLichSuThayDoiHoKhau: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Xem lịch sử thay đổi hộ khẩu theo số hộ khẩu
    @GetMapping("/lich-su-ho-khau/{soHoKhau}")
    public ResponseEntity<List<LichSuThayDoiHoKhau>> xemLichSuThayDoiHoKhau(@PathVariable Long soHoKhau) {
        try {
            List<LichSuThayDoiHoKhau> lichSu = nhanKhauService.xemLichSuThayDoiHoKhau(soHoKhau);
            return ResponseEntity.ok(lichSu);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Thống kê theo giới tính
    @GetMapping("/thong-ke/gioi-tinh")
    public ResponseEntity<Map<String, Object>> thongKeTheoGioiTinh() {
        Map<String, Object> ketQua = thongKeService.thongKeTheoGioiTinh();
        return ResponseEntity.ok(ketQua);
    }

    // Thống kê theo độ tuổi
    @GetMapping("/thong-ke/do-tuoi")
    public ResponseEntity<Map<String, Object>> thongKeTheoDoTuoi() {
        Map<String, Object> ketQua = thongKeService.thongKeTheoDoTuoi();
        return ResponseEntity.ok(ketQua);
    }

    // Thống kê theo thời gian
    @PostMapping("/thong-ke/thoi-gian")
    public ResponseEntity<Map<String, Object>> thongKeTheoThoiGian(@RequestBody ThongKeRequest request) {
        Map<String, Object> ketQua = thongKeService.thongKeTheoThoiGian(request);
        return ResponseEntity.ok(ketQua);
    }

    // Thống kê tạm vắng
    @PostMapping("/thong-ke/tam-vang")
    public ResponseEntity<Map<String, Object>> thongKeTamVang(@RequestBody ThongKeRequest request) {
        Map<String, Object> ketQua = thongKeService.thongKeTamVang(request);
        return ResponseEntity.ok(ketQua);
    }

    // Thống kê tạm trú
    @PostMapping("/thong-ke/tam-tru")
    public ResponseEntity<Map<String, Object>> thongKeTamTru(@RequestBody ThongKeRequest request) {
        Map<String, Object> ketQua = thongKeService.thongKeTamTru(request);
        return ResponseEntity.ok(ketQua);
    }

    // Thống kê tổng hợp
    @PostMapping("/thong-ke/tong-hop")
    public ResponseEntity<Map<String, Object>> thongKeTongHop(@RequestBody ThongKeRequest request) {
        Map<String, Object> ketQua = thongKeService.thongKeTongHop(request);
        return ResponseEntity.ok(ketQua);
    }

    // Mới: API lấy danh sách nhân khẩu theo đường dẫn rõ ràng cho một hộ khẩu
    @GetMapping("/ho-khau/{soHoKhau}")
    public ResponseEntity<List<NhanKhauDTO>> layNhanKhauTheoHoKhau(@PathVariable Long soHoKhau) {
        List<NhanKhau> danhSach = nhanKhauService.layNhanKhauTheoSoHoKhau(soHoKhau);
        List<NhanKhauDTO> dtos = danhSach.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Mới: API lấy danh sách nhân khẩu (tùy chọn lọc theo soHoKhau)
    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity<List<NhanKhauDTO>> layDanhSachNhanKhau(@RequestParam(name = "hoKhauId", required = false) Long hoKhauId) {
        List<NhanKhau> danhSach;
        if (hoKhauId == null) {
            danhSach = nhanKhauService.layTatCaNhanKhau();
        } else {
            danhSach = nhanKhauService.layNhanKhauTheoSoHoKhau(hoKhauId);
        }
        List<NhanKhauDTO> dtos = danhSach.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private NhanKhauDTO toDto(NhanKhau n) {
        NhanKhauDTO d = new NhanKhauDTO();
        d.setMaNhanKhau(n.getMaNhanKhau());
        if (n.getHoKhau() != null) d.setSoHoKhau(n.getHoKhau().getSoHoKhau());
        d.setHoTen(n.getHoTen());
        d.setGioiTinh(n.getGioiTinh());
        d.setNgaySinh(n.getNgaySinh());
        d.setCmnd(n.getCmnd());
        d.setQuanHeVoiChuHo(n.getQuanHeVoiChuHo());
        d.setTrangThai(n.getTrangThai());
        d.setNgheNghiep(n.getNgheNghiep());
        return d;
    }

    @GetMapping("/search-chu-ho")
    public ResponseEntity<List<ChuHoSearchDTO>> searchChuHo(@RequestParam("q") String q) {
        try {
            List<ChuHoSearchDTO> ketQua = nhanKhauService.timKiemChuHo(q);
            return ResponseEntity.ok(ketQua);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật thông tin nhân khẩu (tất cả các trường)
    @PutMapping("/cap-nhat")
    public ResponseEntity<?> capNhatNhanKhau(@RequestBody CapNhatNhanKhauRequest request) {
        try {
            if (request.getMaNhanKhau() == null) {
                return ResponseEntity.badRequest().body("Mã nhân khẩu không được để trống");
            }
            NhanKhau nhanKhau = nhanKhauService.capNhatNhanKhau(request);
            return ResponseEntity.ok(nhanKhau);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Xóa nhân khẩu
    @DeleteMapping(value = "/{maNhanKhau}", produces = "application/json")
    public ResponseEntity<?> xoaNhanKhau(@PathVariable Long maNhanKhau) {
        try {
            if (maNhanKhau == null) {
                return ResponseEntity.badRequest().body("Mã nhân khẩu không được để trống");
            }
            nhanKhauService.xoaNhanKhau(maNhanKhau);
            return ResponseEntity.ok().body("{\"message\":\"Xóa nhân khẩu thành công\"}");
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // Xử lý OPTIONS preflight request cho DELETE
    @RequestMapping(value = "/{maNhanKhau}", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptionsDelete(@PathVariable Long maNhanKhau) {
        return ResponseEntity.ok().build();
    }

    // Xử lý OPTIONS preflight request cho PUT cap-nhat
    @RequestMapping(value = "/cap-nhat", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptionsUpdate() {
        return ResponseEntity.ok().build();
    }
}
