package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.*;
import com.example.householdmanagement.entity.*;
import com.example.householdmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YeuCauThayDoiNhanKhauService {

    @Autowired
    private YeuCauThayDoiNhanKhauRepository yeuCauRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private CanBoRepository canBoRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @Autowired
    private NhanKhauService nhanKhauService;

    public YeuCauThayDoiNhanKhauResponse taoYeuCau(YeuCauThayDoiNhanKhauRequest req) {
        TaiKhoan tk = taiKhoanRepository.findById(req.getMaTaiKhoan())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + req.getMaTaiKhoan()));

        // Kiểm tra tài khoản phải là User (chủ hộ)
        if (!"User".equals(tk.getVaiTro())) {
            throw new RuntimeException("Chỉ chủ hộ mới có thể gửi yêu cầu");
        }

        YeuCauThayDoiNhanKhau yeuCau = new YeuCauThayDoiNhanKhau();
        yeuCau.setTaiKhoan(tk);
        yeuCau.setLoaiYeuCau(req.getLoaiYeuCau());
        yeuCau.setMaNhanKhau(req.getMaNhanKhau());
        yeuCau.setDuLieu(req.getDuLieu());
        yeuCau.setGhiChu(req.getGhiChu());
        yeuCau.setTrangThai("CHO_XAC_THUC");

        YeuCauThayDoiNhanKhau saved = yeuCauRepository.save(yeuCau);
        return toResponse(saved);
    }

    public List<YeuCauThayDoiNhanKhauResponse> layYeuCauTheoTrangThai(String trangThai) {
        List<YeuCauThayDoiNhanKhau> yeuCauList = yeuCauRepository.findByTrangThaiOrderByNgayTaoDesc(trangThai);
        return yeuCauList.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<YeuCauThayDoiNhanKhauResponse> layYeuCauTheoTaiKhoan(Long maTaiKhoan) {
        List<YeuCauThayDoiNhanKhau> yeuCauList = yeuCauRepository.findByTaiKhoan_MaTaiKhoan(maTaiKhoan);
        return yeuCauList.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public YeuCauThayDoiNhanKhauResponse xacThucYeuCau(XacThucYeuCauRequest req) {
        YeuCauThayDoiNhanKhau yeuCau = yeuCauRepository.findById(req.getMaYeuCau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu: " + req.getMaYeuCau()));

        if (!"CHO_XAC_THUC".equals(yeuCau.getTrangThai())) {
            throw new RuntimeException("Yêu cầu này đã được xử lý");
        }

        CanBo canBo = canBoRepository.findById(req.getMaCanBo())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cán bộ: " + req.getMaCanBo()));

        if ("XAC_THUC".equals(req.getHanhDong())) {
            // Xác thực yêu cầu - thực hiện thay đổi
            yeuCau.setTrangThai("DA_XAC_THUC");
            yeuCau.setCanBoXacThuc(canBo);
            yeuCau.setNgayXacThuc(LocalDateTime.now());

            // Thực hiện thay đổi nhân khẩu
            thucHienThayDoiNhanKhau(yeuCau);
        } else if ("TU_CHOI".equals(req.getHanhDong())) {
            // Từ chối yêu cầu
            yeuCau.setTrangThai("TU_CHOI");
            yeuCau.setCanBoXacThuc(canBo);
            yeuCau.setNgayXacThuc(LocalDateTime.now());
            yeuCau.setLyDoTuChoi(req.getLyDoTuChoi());
        }

        YeuCauThayDoiNhanKhau saved = yeuCauRepository.save(yeuCau);
        return toResponse(saved);
    }

    private void thucHienThayDoiNhanKhau(YeuCauThayDoiNhanKhau yeuCau) {
        try {
            // Parse JSON dữ liệu
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Object> duLieuMap = mapper.readValue(yeuCau.getDuLieu(), java.util.Map.class);

            if ("THEM".equals(yeuCau.getLoaiYeuCau())) {
                // Thêm nhân khẩu mới
                NhanKhau nhanKhau = new NhanKhau();
                
                // Lấy số hộ khẩu từ chủ hộ
                Long soHoKhau;
                if (yeuCau.getTaiKhoan().getMaNhanKhau() != null) {
                    soHoKhau = yeuCau.getTaiKhoan().getMaNhanKhau().getHoKhau().getSoHoKhau();
                } else if (duLieuMap.containsKey("soHoKhau")) {
                    soHoKhau = Long.valueOf(duLieuMap.get("soHoKhau").toString());
                } else {
                    throw new RuntimeException("Không tìm thấy số hộ khẩu");
                }

                com.example.householdmanagement.entity.HoKhau hoKhau = 
                    hoKhauRepository.findById(soHoKhau)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau));

                nhanKhau.setHoKhau(hoKhau);
                nhanKhau.setHoTen((String) duLieuMap.get("hoTen"));
                nhanKhau.setGioiTinh((String) duLieuMap.get("gioiTinh"));
                
                if (duLieuMap.containsKey("ngaySinh")) {
                    String ngaySinhStr = duLieuMap.get("ngaySinh").toString();
                    try {
                        // Xử lý cả format date (2005-03-29) và datetime (2005-03-29T00:00:00)
                        if (ngaySinhStr.length() == 10) {
                            // Format date: 2005-03-29 -> chuyển thành LocalDateTime
                            nhanKhau.setNgaySinh(java.time.LocalDate.parse(ngaySinhStr).atStartOfDay());
                        } else {
                            // Format datetime: 2005-03-29T00:00:00
                            nhanKhau.setNgaySinh(java.time.LocalDateTime.parse(ngaySinhStr));
                        }
                    } catch (Exception e) {
                        throw new RuntimeException("Lỗi parse ngày sinh: " + ngaySinhStr + " - " + e.getMessage());
                    }
                }
                
                nhanKhau.setCmnd((String) duLieuMap.get("cmnd"));
                nhanKhau.setNgheNghiep((String) duLieuMap.get("ngheNghiep"));
                nhanKhau.setQuanHeVoiChuHo((String) duLieuMap.get("quanHeVoiChuHo"));
                nhanKhau.setTrangThai("Thuong tru");

                nhanKhauRepository.save(nhanKhau);

            } else if ("SUA".equals(yeuCau.getLoaiYeuCau())) {
                // Sửa nhân khẩu
                if (yeuCau.getMaNhanKhau() == null) {
                    throw new RuntimeException("Không tìm thấy mã nhân khẩu để sửa");
                }

                NhanKhau nhanKhau = nhanKhauRepository.findById(yeuCau.getMaNhanKhau())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + yeuCau.getMaNhanKhau()));

                if (duLieuMap.containsKey("hoTen")) {
                    nhanKhau.setHoTen((String) duLieuMap.get("hoTen"));
                }
                if (duLieuMap.containsKey("gioiTinh")) {
                    nhanKhau.setGioiTinh((String) duLieuMap.get("gioiTinh"));
                }
                if (duLieuMap.containsKey("ngaySinh")) {
                    String ngaySinhStr = duLieuMap.get("ngaySinh").toString();
                    try {
                        // Xử lý cả format date (2005-03-29) và datetime (2005-03-29T00:00:00)
                        if (ngaySinhStr.length() == 10) {
                            // Format date: 2005-03-29 -> chuyển thành LocalDateTime
                            nhanKhau.setNgaySinh(java.time.LocalDate.parse(ngaySinhStr).atStartOfDay());
                        } else {
                            // Format datetime: 2005-03-29T00:00:00
                            nhanKhau.setNgaySinh(java.time.LocalDateTime.parse(ngaySinhStr));
                        }
                    } catch (Exception e) {
                        throw new RuntimeException("Lỗi parse ngày sinh: " + ngaySinhStr + " - " + e.getMessage());
                    }
                }
                if (duLieuMap.containsKey("cmnd")) {
                    nhanKhau.setCmnd((String) duLieuMap.get("cmnd"));
                }
                if (duLieuMap.containsKey("ngheNghiep")) {
                    nhanKhau.setNgheNghiep((String) duLieuMap.get("ngheNghiep"));
                }
                if (duLieuMap.containsKey("quanHeVoiChuHo")) {
                    nhanKhau.setQuanHeVoiChuHo((String) duLieuMap.get("quanHeVoiChuHo"));
                }

                nhanKhauRepository.save(nhanKhau);

            } else if ("XOA".equals(yeuCau.getLoaiYeuCau())) {
                // Xóa nhân khẩu
                if (yeuCau.getMaNhanKhau() == null) {
                    throw new RuntimeException("Không tìm thấy mã nhân khẩu để xóa");
                }

                NhanKhau nhanKhau = nhanKhauRepository.findById(yeuCau.getMaNhanKhau())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + yeuCau.getMaNhanKhau()));

                // Không cho phép xóa chủ hộ
                if ("Chủ hộ".equals(nhanKhau.getQuanHeVoiChuHo())) {
                    throw new RuntimeException("Không thể xóa chủ hộ");
                }

                nhanKhauRepository.delete(nhanKhau);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thực hiện thay đổi nhân khẩu: " + e.getMessage(), e);
        }
    }

    private YeuCauThayDoiNhanKhauResponse toResponse(YeuCauThayDoiNhanKhau yeuCau) {
        YeuCauThayDoiNhanKhauResponse res = new YeuCauThayDoiNhanKhauResponse();
        res.setMaYeuCau(yeuCau.getMaYeuCau());
        res.setMaTaiKhoan(yeuCau.getTaiKhoan().getMaTaiKhoan());
        res.setTenDangNhap(yeuCau.getTaiKhoan().getTenDangNhap());

        // Lấy thông tin chủ hộ
        if (yeuCau.getTaiKhoan().getMaNhanKhau() != null) {
            NhanKhau chuHo = yeuCau.getTaiKhoan().getMaNhanKhau();
            res.setHoTenChuHo(chuHo.getHoTen());
            res.setSoHoKhau(chuHo.getHoKhau().getSoHoKhau());
        }

        res.setLoaiYeuCau(yeuCau.getLoaiYeuCau());
        res.setLoaiYeuCauLabel(getLoaiYeuCauLabel(yeuCau.getLoaiYeuCau()));
        res.setMaNhanKhau(yeuCau.getMaNhanKhau());
        res.setDuLieu(yeuCau.getDuLieu());
        res.setTrangThai(yeuCau.getTrangThai());
        res.setTrangThaiLabel(getTrangThaiLabel(yeuCau.getTrangThai()));
        res.setGhiChu(yeuCau.getGhiChu());
        res.setLyDoTuChoi(yeuCau.getLyDoTuChoi());

        if (yeuCau.getCanBoXacThuc() != null) {
            res.setMaCanBoXacThuc(yeuCau.getCanBoXacThuc().getMaCanBo());
            res.setTenCanBoXacThuc(yeuCau.getCanBoXacThuc().getHoTen());
        }

        res.setNgayXacThuc(yeuCau.getNgayXacThuc());
        res.setNgayTao(yeuCau.getNgayTao());

        return res;
    }

    private String getLoaiYeuCauLabel(String loaiYeuCau) {
        if ("THEM".equals(loaiYeuCau)) return "Thêm nhân khẩu";
        if ("SUA".equals(loaiYeuCau)) return "Sửa nhân khẩu";
        if ("XOA".equals(loaiYeuCau)) return "Xóa nhân khẩu";
        return loaiYeuCau;
    }

    private String getTrangThaiLabel(String trangThai) {
        if ("CHO_XAC_THUC".equals(trangThai)) return "Chờ xác thực";
        if ("DA_XAC_THUC".equals(trangThai)) return "Đã xác thực";
        if ("TU_CHOI".equals(trangThai)) return "Từ chối";
        return trangThai;
    }
}

