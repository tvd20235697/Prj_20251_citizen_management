package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.*;
import com.example.householdmanagement.entity.*;
import com.example.householdmanagement.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NhanKhauService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @Autowired
    private LichSuThayDoiNhanKhauRepository lichSuThayDoiNhanKhauRepository;

    @Autowired
    private LichSuThayDoiHoKhauRepository lichSuThayDoiHoKhauRepository;

    @Autowired
    private XaPhuongRepository xaPhuongRepository;

    @Autowired
    private TamVangRepository tamVangRepository;

    @Autowired
    private TamTruRepository tamTruRepository;

    // Thêm nhân khẩu mới (trẻ mới sinh)
    @Transactional
    public NhanKhau themNhanKhauMoi(ThemNhanKhauMoiRequest request) {
        HoKhau hoKhau = hoKhauRepository.findById(request.getSoHoKhau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu"));

        NhanKhau nhanKhau = new NhanKhau();
        nhanKhau.setHoKhau(hoKhau);
        nhanKhau.setHoTen(request.getHoTen());
        nhanKhau.setGioiTinh(request.getGioiTinh());
        nhanKhau.setNgaySinh(request.getNgaySinh());
        nhanKhau.setQuanHeVoiChuHo(request.getQuanHeVoiChuHo());
        // Sử dụng trangThai từ request, nếu không có thì mặc định là "Moi sinh"
        nhanKhau.setTrangThai(request.getTrangThai() != null && !request.getTrangThai().isEmpty() 
            ? request.getTrangThai() : "Moi sinh");
        nhanKhau.setNgheNghiep(request.getNgheNghiep());
        nhanKhau.setCmnd(null);
        nhanKhau.setNoiThuongTruChuyenDen("mới sinh");

        NhanKhau savedNhanKhau = nhanKhauRepository.save(nhanKhau);

        LichSuThayDoiNhanKhau lichSu = new LichSuThayDoiNhanKhau();
        lichSu.setNhanKhau(savedNhanKhau);
        lichSu.setLoaiThayDoi("Them moi");
        lichSu.setNoiDungThayDoi("Thêm nhân khẩu mới: " + request.getHoTen());
        lichSu.setNgayThayDoi(LocalDateTime.now());
        lichSu.setGhiChu("Trẻ mới sinh");
        lichSuThayDoiNhanKhauRepository.save(lichSu);

        return savedNhanKhau;
    }

    // Thay đổi nhân khẩu (chuyển đi, qua đời)
    @Transactional
    public NhanKhau thayDoiNhanKhau(ThayDoiNhanKhauRequest request) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(request.getMaNhanKhau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu"));

        if ("Chuyen di".equals(request.getLoaiThayDoi())) {
            nhanKhau.setNgayChuyenDi(request.getNgayChuyenDi());
            nhanKhau.setNoiChuyen(request.getNoiChuyen());
            nhanKhau.setGhiChu(request.getGhiChu());
            nhanKhau.setTrangThai("Chuyen di");
        } else if ("Qua doi".equals(request.getLoaiThayDoi())) {
            nhanKhau.setGhiChu("Đã qua đời");
            nhanKhau.setTrangThai("Qua doi");
        } else if ("Thay doi thong tin".equals(request.getLoaiThayDoi()) || "Cap nhat trang thai".equals(request.getLoaiThayDoi())) {
            if (request.getGhiChu() != null) {
                nhanKhau.setGhiChu(request.getGhiChu());
            }
            // Cập nhật trạng thái nếu có trong request
            if (request.getTrangThai() != null && !request.getTrangThai().isEmpty()) {
                nhanKhau.setTrangThai(request.getTrangThai());
            }
        }

        NhanKhau savedNhanKhau = nhanKhauRepository.save(nhanKhau);

        LichSuThayDoiNhanKhau lichSu = new LichSuThayDoiNhanKhau();
        lichSu.setNhanKhau(savedNhanKhau);
        lichSu.setLoaiThayDoi(request.getLoaiThayDoi());
        lichSu.setNoiDungThayDoi(request.getNoiDungThayDoi() != null ? 
                request.getNoiDungThayDoi() : "Thay đổi nhân khẩu: " + request.getLoaiThayDoi());
        lichSu.setNgayThayDoi(LocalDateTime.now());
        lichSu.setGhiChu(request.getGhiChu());
        lichSuThayDoiNhanKhauRepository.save(lichSu);

        return savedNhanKhau;
    }

    // Thay đổi chủ hộ
    @Transactional
    public HoKhau thayDoiChuHo(ThayDoiChuHoRequest request) {
        HoKhau hoKhau = hoKhauRepository.findById(request.getSoHoKhau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu"));

        NhanKhau chuHoCu = nhanKhauRepository.findChuHoBySoHoKhau(request.getSoHoKhau());
        if (chuHoCu != null) {
            chuHoCu.setQuanHeVoiChuHo("Thanh vien");
            nhanKhauRepository.save(chuHoCu);
        }

        NhanKhau chuHoMoi = nhanKhauRepository.findById(request.getMaNhanKhauMoi())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu mới"));
        chuHoMoi.setQuanHeVoiChuHo("Chu ho");
        nhanKhauRepository.save(chuHoMoi);

        LichSuThayDoiHoKhau lichSu = new LichSuThayDoiHoKhau();
        lichSu.setHoKhau(hoKhau);
        lichSu.setNoiDungThayDoi(request.getNoiDungThayDoi() != null ?
                request.getNoiDungThayDoi() : "Thay đổi chủ hộ");
        lichSu.setNgayThayDoi(LocalDateTime.now());
        lichSu.setGhiChu(request.getGhiChu());
        lichSuThayDoiHoKhauRepository.save(lichSu);

        return hoKhau;
    }

    // Tách hộ khẩu
    @Transactional
    public HoKhau tachHo(TachHoRequest request) {
        HoKhau hoKhauGoc = hoKhauRepository.findById(request.getSoHoKhauGoc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu gốc"));

        XaPhuong xaPhuong = xaPhuongRepository.findById(request.getMaXaPhuong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xã phường"));

        HoKhau hoKhauMoi = new HoKhau();
        hoKhauMoi.setDiaChi(request.getDiaChiMoi());
        hoKhauMoi.setXaPhuong(xaPhuong);
        hoKhauMoi.setGhiChu(request.getGhiChu());
        HoKhau savedHoKhauMoi = hoKhauRepository.save(hoKhauMoi);

        boolean coChuHo = false;
        for (Long maNhanKhau : request.getDanhSachMaNhanKhau()) {
            NhanKhau nhanKhau = nhanKhauRepository.findById(maNhanKhau)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + maNhanKhau));
            
            if ("Chu ho".equals(nhanKhau.getQuanHeVoiChuHo())) {
                coChuHo = true;
            }
            
            nhanKhau.setHoKhau(savedHoKhauMoi);
            nhanKhauRepository.save(nhanKhau);
        }

        if (!coChuHo && !request.getDanhSachMaNhanKhau().isEmpty()) {
            NhanKhau nhanKhauDauTien = nhanKhauRepository.findById(request.getDanhSachMaNhanKhau().get(0))
                    .orElseThrow();
            nhanKhauDauTien.setQuanHeVoiChuHo("Chu ho");
            nhanKhauRepository.save(nhanKhauDauTien);
        }

        LichSuThayDoiHoKhau lichSuGoc = new LichSuThayDoiHoKhau();
        lichSuGoc.setHoKhau(hoKhauGoc);
        lichSuGoc.setNoiDungThayDoi("Tách hộ - một số nhân khẩu chuyển sang hộ khẩu mới: " + savedHoKhauMoi.getSoHoKhau());
        lichSuGoc.setNgayThayDoi(LocalDateTime.now());
        lichSuGoc.setGhiChu(request.getGhiChu());
        lichSuThayDoiHoKhauRepository.save(lichSuGoc);

        LichSuThayDoiHoKhau lichSuMoi = new LichSuThayDoiHoKhau();
        lichSuMoi.setHoKhau(savedHoKhauMoi);
        lichSuMoi.setNoiDungThayDoi("Hộ khẩu mới được tách từ hộ khẩu: " + hoKhauGoc.getSoHoKhau());
        lichSuMoi.setNgayThayDoi(LocalDateTime.now());
        lichSuMoi.setGhiChu("Hộ khẩu mới");
        lichSuThayDoiHoKhauRepository.save(lichSuMoi);

        return savedHoKhauMoi;
    }

    // Quản lý tạm vắng
    @Transactional
    public TamVang themTamVang(TamVangRequest request) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(request.getMaNhanKhau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu"));

        TamVang tamVang = new TamVang();
        tamVang.setNhanKhau(nhanKhau);
        tamVang.setNoiDi(request.getNoiDi());
        tamVang.setTuNgay(request.getTuNgay());
        tamVang.setDenNgay(request.getDenNgay());
        tamVang.setLyDo(request.getLyDo());
        tamVang.setGhiChu(request.getGhiChu());
        tamVang.setTrangThai("Dang tam vang");

        return tamVangRepository.save(tamVang);
    }

    @Transactional
    public TamVang capNhatTamVang(Long id, TamVangRequest request) {
        TamVang tamVang = tamVangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi tạm vắng"));

        if (request.getMaNhanKhau() != null) {
            NhanKhau nhanKhau = nhanKhauRepository.findById(request.getMaNhanKhau())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu"));
            tamVang.setNhanKhau(nhanKhau);
        }
        if (request.getNoiDi() != null) {
            tamVang.setNoiDi(request.getNoiDi());
        }
        if (request.getTuNgay() != null) {
            tamVang.setTuNgay(request.getTuNgay());
        }
        if (request.getDenNgay() != null) {
            tamVang.setDenNgay(request.getDenNgay());
        }
        if (request.getLyDo() != null) {
            tamVang.setLyDo(request.getLyDo());
        }
        if (request.getGhiChu() != null) {
            tamVang.setGhiChu(request.getGhiChu());
        }

        return tamVangRepository.save(tamVang);
    }

    @Transactional
    public TamVang ketThucTamVang(Long id) {
        TamVang tamVang = tamVangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi tạm vắng"));

        tamVang.setTrangThai("Ket thuc");
        return tamVangRepository.save(tamVang);
    }

    // Quản lý tạm trú
    @Transactional
    public TamTru themTamTru(TamTruRequest request) {
        NhanKhau nhanKhau = nhanKhauRepository.findById(request.getMaNhanKhau())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu"));

        TamTru tamTru = new TamTru();
        tamTru.setNhanKhau(nhanKhau);
        tamTru.setNoiTamTru(request.getNoiTamTru());
        tamTru.setTuNgay(request.getTuNgay());
        tamTru.setDenNgay(request.getDenNgay());
        tamTru.setLyDo(request.getLyDo());
        tamTru.setGhiChu(request.getGhiChu());
        tamTru.setTrangThai("Dang tam tru");

        return tamTruRepository.save(tamTru);
    }

    // Tìm kiếm nhân khẩu
    public List<NhanKhau> timKiemNhanKhau(TimKiemRequest request) {
        if (request.getHoTen() != null && !request.getHoTen().isEmpty()) {
            return nhanKhauRepository.findByHoTenContainingIgnoreCase(request.getHoTen());
        } else if (request.getSoHoKhau() != null) {
            return nhanKhauRepository.findByHoKhau_SoHoKhau(request.getSoHoKhau());
        } else if (request.getCmnd() != null && !request.getCmnd().isEmpty()) {
            return nhanKhauRepository.findByCmnd(request.getCmnd());
        }
        return nhanKhauRepository.findAll();
    }

    // Xem lịch sử thay đổi nhân khẩu của một hộ
    public List<LichSuThayDoiNhanKhauDTO> xemLichSuThayDoiNhanKhau(Long soHoKhau) {
        List<LichSuThayDoiNhanKhau> lichSuList = lichSuThayDoiNhanKhauRepository.findBySoHoKhauOrderByNgayThayDoiDesc(soHoKhau);
        return lichSuList.stream()
                .map(this::toLichSuThayDoiNhanKhauDTO)
                .collect(Collectors.toList());
    }

    private LichSuThayDoiNhanKhauDTO toLichSuThayDoiNhanKhauDTO(LichSuThayDoiNhanKhau lichSu) {
        LichSuThayDoiNhanKhauDTO dto = new LichSuThayDoiNhanKhauDTO();
        dto.setMaLichSuThayDoi(lichSu.getMaLichSuThayDoi());
        
        NhanKhau nhanKhau = lichSu.getNhanKhau();
        if (nhanKhau != null) {
            dto.setMaNhanKhau(nhanKhau.getMaNhanKhau());
            dto.setHoTen(nhanKhau.getHoTen());
            dto.setNgayChuyenDi(nhanKhau.getNgayChuyenDi());
            dto.setNoiChuyen(nhanKhau.getNoiChuyen());
            
            if (nhanKhau.getGhiChu() != null && !nhanKhau.getGhiChu().trim().isEmpty()) {
                dto.setGhiChu(nhanKhau.getGhiChu());
            }
        }
        
        dto.setLoaiThayDoi(lichSu.getLoaiThayDoi());
        dto.setNoiDungThayDoi(lichSu.getNoiDungThayDoi());
        dto.setNgayThayDoi(lichSu.getNgayThayDoi());
        
        if (lichSu.getGhiChu() != null && !lichSu.getGhiChu().trim().isEmpty()) {
            dto.setGhiChu(lichSu.getGhiChu());
        }
        
        return dto;
    }

    // Xem lịch sử thay đổi nhân khẩu theo mã nhân khẩu
    public List<LichSuThayDoiNhanKhauDTO> xemLichSuThayDoiNhanKhauTheoMa(Long maNhanKhau) {
        List<LichSuThayDoiNhanKhau> lichSuList = lichSuThayDoiNhanKhauRepository.findByNhanKhau_MaNhanKhauOrderByNgayThayDoiDesc(maNhanKhau);
        
        List<LichSuThayDoiNhanKhau> filteredList = lichSuList.stream()
                .filter(lichSu -> {
                    if (lichSu.getNhanKhau() == null) {
                        return false;
                    }
                    Long actualMaNhanKhau = lichSu.getNhanKhau().getMaNhanKhau();
                    return actualMaNhanKhau != null && actualMaNhanKhau.equals(maNhanKhau);
                })
                .collect(Collectors.toList());
        
        return filteredList.stream()
                .map(this::toLichSuThayDoiNhanKhauDTO)
                .collect(Collectors.toList());
    }

    // Xem tất cả lịch sử thay đổi nhân khẩu
    @Transactional(readOnly = true)
    public List<LichSuThayDoiNhanKhauDTO> xemTatCaLichSuThayDoiNhanKhau() {
        List<LichSuThayDoiNhanKhau> lichSuList = lichSuThayDoiNhanKhauRepository.findAllWithNhanKhauAndHoKhau();
        return lichSuList.stream()
                .map(this::toLichSuThayDoiNhanKhauDTO)
                .collect(Collectors.toList());
    }

    // Xem lịch sử thay đổi hộ khẩu theo số hộ khẩu
    public List<LichSuThayDoiHoKhau> xemLichSuThayDoiHoKhau(Long soHoKhau) {
        return lichSuThayDoiHoKhauRepository.findByHoKhau_SoHoKhauOrderByNgayThayDoiDesc(soHoKhau);
    }

    // Xem tất cả lịch sử thay đổi hộ khẩu
    @Transactional(readOnly = true)
    public List<LichSuThayDoiHoKhau> xemTatCaLichSuThayDoiHoKhau() {
        return lichSuThayDoiHoKhauRepository.findAllWithHoKhau();
    }

    // Thêm các phương thức đọc (chỉ đọc) để trả danh sách nhân khẩu
    @Transactional(readOnly = true)
    public List<NhanKhau> layTatCaNhanKhau() {
        return nhanKhauRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<NhanKhau> layNhanKhauTheoSoHoKhau(Long soHoKhau) {
        return nhanKhauRepository.findByHoKhau_SoHoKhau(soHoKhau);
    }

    @Transactional(readOnly = true)
    public List<HoKhau> layTatCaHoKhau() {
        return hoKhauRepository.findAll();
    }

    @Transactional(readOnly = true)
    public HoKhau layHoKhauTheoSoHoKhau(Long soHoKhau) {
        return hoKhauRepository.findById(soHoKhau).orElse(null);
    }

    // Cập nhật thông tin nhân khẩu (tất cả các trường)
    @Transactional
    public NhanKhau capNhatNhanKhau(CapNhatNhanKhauRequest request) {
        if (request.getMaNhanKhau() == null) {
            throw new RuntimeException("Mã nhân khẩu không được để trống");
        }
        
        // Kiểm tra tồn tại bằng native query để tránh vấn đề với JOIN phức tạp
        if (!nhanKhauRepository.existsByIdNative(request.getMaNhanKhau())) {
            throw new RuntimeException("Không tìm thấy nhân khẩu với mã: " + request.getMaNhanKhau());
        }
        
        // Sử dụng getReferenceById để tránh load association, chỉ tạo proxy
        NhanKhau nhanKhau = nhanKhauRepository.getReferenceById(request.getMaNhanKhau());

        // Cập nhật tất cả các trường (không truy cập vào hoKhau association)
        if (request.getHoTen() != null && !request.getHoTen().trim().isEmpty()) {
            nhanKhau.setHoTen(request.getHoTen().trim());
        }
        if (request.getGioiTinh() != null && !request.getGioiTinh().trim().isEmpty()) {
            nhanKhau.setGioiTinh(request.getGioiTinh().trim());
        }
        if (request.getNgaySinh() != null) {
            nhanKhau.setNgaySinh(request.getNgaySinh());
        }
        if (request.getCmnd() != null) {
            nhanKhau.setCmnd(request.getCmnd().trim());
        }
        if (request.getNgheNghiep() != null) {
            nhanKhau.setNgheNghiep(request.getNgheNghiep().trim());
        }
        if (request.getQuanHeVoiChuHo() != null && !request.getQuanHeVoiChuHo().trim().isEmpty()) {
            nhanKhau.setQuanHeVoiChuHo(request.getQuanHeVoiChuHo().trim());
        }
        if (request.getTrangThai() != null && !request.getTrangThai().trim().isEmpty()) {
            nhanKhau.setTrangThai(request.getTrangThai().trim());
        }

        // Sử dụng EntityManager.merge() để tránh vấn đề với association
        NhanKhau savedNhanKhau = entityManager.merge(nhanKhau);
        entityManager.flush(); // Đảm bảo thay đổi được lưu ngay

        // Ghi lịch sử thay đổi
        try {
            LichSuThayDoiNhanKhau lichSu = new LichSuThayDoiNhanKhau();
            // Sử dụng getReferenceById để tránh load association khi ghi lịch sử
            lichSu.setNhanKhau(nhanKhauRepository.getReferenceById(request.getMaNhanKhau()));
            lichSu.setLoaiThayDoi("Cap nhat thong tin");
            String hoTenForHistory = savedNhanKhau.getHoTen() != null ? savedNhanKhau.getHoTen() : "Không xác định";
            lichSu.setNoiDungThayDoi("Cập nhật thông tin nhân khẩu: " + hoTenForHistory);
            lichSu.setNgayThayDoi(LocalDateTime.now());
            lichSu.setGhiChu("Cập nhật bởi quản trị viên");
            lichSuThayDoiNhanKhauRepository.save(lichSu);
        } catch (Exception e) {
            System.err.println("Lỗi khi ghi lịch sử thay đổi: " + e.getMessage());
        }

        return savedNhanKhau;
    }

    @Transactional
    public void xoaNhanKhau(Long maNhanKhau) {
        if (maNhanKhau == null) {
            throw new RuntimeException("Mã nhân khẩu không được để trống");
        }
        
        // Kiểm tra tồn tại bằng native query để tránh vấn đề với JOIN phức tạp
        if (!nhanKhauRepository.existsByIdNative(maNhanKhau)) {
            throw new RuntimeException("Không tìm thấy nhân khẩu với mã: " + maNhanKhau);
        }
        
        // Lấy tên nhân khẩu bằng native query để ghi lịch sử (không load association)
        String hoTen = "Không xác định";
        try {
            String hoTenFromDb = nhanKhauRepository.getHoTenById(maNhanKhau);
            if (hoTenFromDb != null && !hoTenFromDb.trim().isEmpty()) {
                hoTen = hoTenFromDb.trim();
            }
            
            // Ghi lịch sử thay đổi trước khi xóa
            try {
                // Sử dụng getReferenceById để tạo proxy, không load dữ liệu
                NhanKhau nhanKhauProxy = nhanKhauRepository.getReferenceById(maNhanKhau);
                LichSuThayDoiNhanKhau lichSu = new LichSuThayDoiNhanKhau();
                lichSu.setNhanKhau(nhanKhauProxy);
                lichSu.setLoaiThayDoi("Xoa");
                lichSu.setNoiDungThayDoi("Xóa nhân khẩu: " + hoTen + " (Mã: " + maNhanKhau + ")");
                lichSu.setNgayThayDoi(LocalDateTime.now());
                lichSu.setGhiChu("Xóa bởi quản trị viên");
                lichSuThayDoiNhanKhauRepository.save(lichSu);
            } catch (Exception e) {
                // Log lỗi nhưng vẫn tiếp tục xóa
                System.err.println("Lỗi khi ghi lịch sử xóa nhân khẩu: " + e.getMessage());
            }
        } catch (Exception e) {
            // Nếu không lấy được tên, vẫn tiếp tục xóa
            System.err.println("Không thể lấy tên nhân khẩu trước khi xóa: " + e.getMessage());
        }

        // Xóa nhân khẩu trực tiếp bằng ID, không cần load entity
        nhanKhauRepository.deleteById(maNhanKhau);
    }

    public List<ChuHoSearchDTO> timKiemChuHo(String query) {
        if (query == null) return Collections.emptyList();
        String q = query.trim();
        if (q.length() < 2) return Collections.emptyList();

        List<NhanKhau> results = new ArrayList<>();

        results.addAll(nhanKhauRepository.searchByRoleAndHoTen("Chủ hộ", q));
        results.addAll(nhanKhauRepository.searchByRoleAndCmnd("Chủ hộ", q));

        try {
            Long soHo = Long.parseLong(q);
            results.addAll(nhanKhauRepository.searchByRoleAndSoHo("Chủ hộ", soHo));
        } catch (NumberFormatException ignored) {}

        Map<Long, NhanKhau> unique = results.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(NhanKhau::getMaNhanKhau, n -> n, (a, b) -> a));

        return unique.values().stream().map(n -> {
            HoKhau hk = n.getHoKhau();
            Long soHo = hk != null ? hk.getSoHoKhau() : null;
            String diaChi = hk != null ? (hk.getDiaChi() != null ? hk.getDiaChi() : "") : "";
            return new ChuHoSearchDTO(n.getMaNhanKhau(), n.getHoTen(), n.getCmnd(), soHo, diaChi);
        }).collect(Collectors.toList());
    }
}
