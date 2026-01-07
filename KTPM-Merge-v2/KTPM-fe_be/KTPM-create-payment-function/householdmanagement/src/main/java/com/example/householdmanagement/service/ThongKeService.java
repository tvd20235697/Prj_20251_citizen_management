package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.ThongKeRequest;
import com.example.householdmanagement.entity.NhanKhau;
import com.example.householdmanagement.entity.TamTru;
import com.example.householdmanagement.entity.TamVang;
import com.example.householdmanagement.repository.NhanKhauRepository;
import com.example.householdmanagement.repository.TamTruRepository;
import com.example.householdmanagement.repository.TamVangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeService {

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private TamVangRepository tamVangRepository;

    @Autowired
    private TamTruRepository tamTruRepository;

    // Thống kê theo giới tính
    public Map<String, Object> thongKeTheoGioiTinh() {
        List<NhanKhau> allNhanKhau = nhanKhauRepository.findAll();
        
        long soNam = 0;
        long soNu = 0;
        long soKhongXacDinh = 0;
        
        for (NhanKhau nk : allNhanKhau) {
            String gioiTinh = nk.getGioiTinh();
            if (gioiTinh == null || gioiTinh.trim().isEmpty()) {
                soKhongXacDinh++;
                continue;
            }
            
            // Loại bỏ khoảng trắng và chuyển về chữ thường
            String gioiTinhNormalized = gioiTinh.trim().toLowerCase();
            
            // Kiểm tra các biến thể của "Nam" - có thể là "nam", "Nam", "NAM", v.v.
            if (gioiTinhNormalized.equals("nam")) {
                soNam++;
            }
            // Kiểm tra các biến thể của "Nữ" - bao gồm cả "N?" (encoding lỗi)
            // Xử lý cả Unicode và ASCII, và cả trường hợp encoding lỗi
            else if (gioiTinhNormalized.equals("nữ") || 
                     gioiTinhNormalized.equals("nu") ||
                     gioiTinhNormalized.equals("nư") || // Trường hợp encoding lỗi một phần
                     gioiTinhNormalized.equals("n?") || // Trường hợp encoding lỗi "N?" -> "n?"
                     gioiTinhNormalized.startsWith("n") && gioiTinhNormalized.length() <= 2) { // Nhận diện "N?", "Nu", "Nư", v.v.
                soNu++;
            } else {
                // Trường hợp không khớp - có thể là dữ liệu lỗi
                soKhongXacDinh++;
                System.out.println("Giới tính không xác định: '" + gioiTinh + "' (Mã nhân khẩu: " + nk.getMaNhanKhau() + ")");
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("tongSo", allNhanKhau.size());
        result.put("nam", soNam);
        result.put("nu", soNu);
        // Thêm thông tin debug nếu có
        if (soKhongXacDinh > 0) {
            result.put("khongXacDinh", soKhongXacDinh);
        }
        return result;
    }

    // Thống kê theo độ tuổi
    public Map<String, Object> thongKeTheoDoTuoi() {
        List<NhanKhau> allNhanKhau = nhanKhauRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        Map<String, Long> thongKe = new HashMap<>();
        thongKe.put("Mam non", 0L); // 0-3 tuổi
        thongKe.put("Mau giao", 0L); // 3-6 tuổi
        thongKe.put("Cap 1", 0L); // 6-11 tuổi
        thongKe.put("Cap 2", 0L); // 11-15 tuổi
        thongKe.put("Cap 3", 0L); // 15-18 tuổi
        thongKe.put("Do tuoi lao dong", 0L); // 18-60 tuổi (nam), 18-55 tuổi (nữ)
        thongKe.put("Nghi huu", 0L); // >60 tuổi (nam), >55 tuổi (nữ)

        for (NhanKhau nk : allNhanKhau) {
            if (nk.getNgaySinh() == null) continue;

            int tuoi = Period.between(nk.getNgaySinh().toLocalDate(), now.toLocalDate()).getYears();
            String gioiTinh = nk.getGioiTinh();

            if (tuoi < 3) {
                thongKe.put("Mam non", thongKe.get("Mam non") + 1);
            } else if (tuoi < 6) {
                thongKe.put("Mau giao", thongKe.get("Mau giao") + 1);
            } else if (tuoi < 11) {
                thongKe.put("Cap 1", thongKe.get("Cap 1") + 1);
            } else if (tuoi < 15) {
                thongKe.put("Cap 2", thongKe.get("Cap 2") + 1);
            } else if (tuoi < 18) {
                thongKe.put("Cap 3", thongKe.get("Cap 3") + 1);
            } else {
                // Xác định giới tính để tính tuổi nghỉ hưu
                boolean isNu = false;
                if (gioiTinh != null && !gioiTinh.trim().isEmpty()) {
                    String gioiTinhLower = gioiTinh.trim().toLowerCase();
                    isNu = gioiTinhLower.equals("nữ") || gioiTinhLower.equals("nu");
                }
                int tuoiNghiHuu = isNu ? 55 : 60;
                
                if (tuoi < tuoiNghiHuu) {
                    thongKe.put("Do tuoi lao dong", thongKe.get("Do tuoi lao dong") + 1);
                } else {
                    thongKe.put("Nghi huu", thongKe.get("Nghi huu") + 1);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("tongSo", allNhanKhau.size());
        result.put("chiTiet", thongKe);
        return result;
    }

    // Thống kê theo khoảng thời gian
    public Map<String, Object> thongKeTheoThoiGian(ThongKeRequest request) {
        LocalDateTime tuNgay = request.getTuNgay() != null ? request.getTuNgay() : LocalDateTime.now().minusYears(1);
        LocalDateTime denNgay = request.getDenNgay() != null ? request.getDenNgay() : LocalDateTime.now();

        List<NhanKhau> nhanKhauTrongKhoang = nhanKhauRepository.findByNgaySinhBetween(tuNgay, denNgay);

        Map<String, Object> result = new HashMap<>();
        result.put("tuNgay", tuNgay);
        result.put("denNgay", denNgay);
        result.put("tongSo", nhanKhauTrongKhoang.size());
        result.put("danhSach", nhanKhauTrongKhoang);
        return result;
    }

    // Thống kê tạm vắng
    public Map<String, Object> thongKeTamVang(ThongKeRequest request) {
        List<TamVang> tamVangList;
        
        // Luôn lấy tất cả các bản ghi tạm vắng (cả đang và đã tạm vắng)
        // Vì đây là thống kê tổng quan "Đang / đã tạm vắng"
        // Nếu cần lọc theo thời gian, sẽ dùng filter ở frontend
        tamVangList = tamVangRepository.findAll();

        Map<String, Object> result = new HashMap<>();
        result.put("tongSo", tamVangList.size());
        result.put("danhSach", tamVangList);
        
        // Thống kê theo trạng thái
        Map<String, Long> theoTrangThai = tamVangList.stream()
                .collect(Collectors.groupingBy(TamVang::getTrangThai, Collectors.counting()));
        result.put("theoTrangThai", theoTrangThai);
        
        return result;
    }

    // Thống kê tạm trú
    public Map<String, Object> thongKeTamTru(ThongKeRequest request) {
        List<TamTru> tamTruList;
        
        // Luôn lấy tất cả các bản ghi tạm trú (cả đang và đã tạm trú)
        // Vì đây là thống kê tổng quan "Đang / đã tạm trú"
        // Nếu cần lọc theo thời gian, sẽ dùng filter ở frontend
        tamTruList = tamTruRepository.findAll();

        Map<String, Object> result = new HashMap<>();
        result.put("tongSo", tamTruList.size());
        result.put("danhSach", tamTruList);
        
        // Thống kê theo trạng thái
        Map<String, Long> theoTrangThai = tamTruList.stream()
                .collect(Collectors.groupingBy(TamTru::getTrangThai, Collectors.counting()));
        result.put("theoTrangThai", theoTrangThai);
        
        return result;
    }

    // Thống kê tổng hợp
    public Map<String, Object> thongKeTongHop(ThongKeRequest request) {
        Map<String, Object> result = new HashMap<>();
        
        if ("GioiTinh".equals(request.getLoaiThongKe())) {
            result = thongKeTheoGioiTinh();
        } else if ("DoTuoi".equals(request.getLoaiThongKe())) {
            result = thongKeTheoDoTuoi();
        } else if ("ThoiGian".equals(request.getLoaiThongKe())) {
            result = thongKeTheoThoiGian(request);
        } else if ("TamVang".equals(request.getLoaiThongKe())) {
            result = thongKeTamVang(request);
        } else if ("TamTru".equals(request.getLoaiThongKe())) {
            result = thongKeTamTru(request);
        }
        
        return result;
    }
}


