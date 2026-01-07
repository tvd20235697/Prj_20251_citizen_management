package com.example.householdmanagement.service;

import com.example.householdmanagement.entity.HoKhau;
import com.example.householdmanagement.entity.NhanKhau;
import com.example.householdmanagement.entity.XaPhuong;
import com.example.householdmanagement.repository.HoKhauRepository;
import com.example.householdmanagement.repository.NhanKhauRepository;
import com.example.householdmanagement.repository.XaPhuongRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.hibernate.jdbc.Work;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Service
public class HoKhauService {

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private XaPhuongRepository xaPhuongRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public HoKhau layHoKhauTheoSoHoKhau(Long soHoKhau) {
        return hoKhauRepository.findById(soHoKhau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau));
    }

    public List<HoKhau> layTatCaHoKhau() {
        return hoKhauRepository.findAll();
    }

    public Long demSoNhanKhau(Long soHoKhau) {
        List<NhanKhau> nhanKhauList = nhanKhauRepository.findByHoKhau_SoHoKhau(soHoKhau);
        return (long) nhanKhauList.size();
    }

    public NhanKhau layChuHo(Long soHoKhau) {
        List<NhanKhau> nhanKhauList = nhanKhauRepository.findByHoKhau_SoHoKhau(soHoKhau);
        if (nhanKhauList == null || nhanKhauList.isEmpty()) {
            return null;
        }
        
        // Thử tìm với nhiều cách khác nhau
        for (NhanKhau nk : nhanKhauList) {
            String rel = nk.getQuanHeVoiChuHo();
            if (rel == null) continue;
            
            // Loại bỏ khoảng trắng thừa và chuyển về chữ thường để so sánh
            String normalized = rel.trim().toLowerCase();
            
            // Chấp nhận nhiều biến thể: "Chủ hộ", "Chu ho", "Chủ hộ", "chu ho", v.v.
            if (normalized.equals("chủ hộ") || 
                normalized.equals("chu ho") || 
                normalized.equals("chuho") ||
                normalized.contains("chu ho") ||
                normalized.contains("chủ hộ")) {
                return nk;
            }
        }
        
        // Nếu không tìm thấy, log để debug
        System.out.println("DEBUG: Không tìm thấy chủ hộ cho hộ khẩu " + soHoKhau);
        System.out.println("DEBUG: Danh sách quan hệ: " + 
            nhanKhauList.stream()
                .map(nk -> nk.getQuanHeVoiChuHo())
                .collect(java.util.stream.Collectors.toList()));
        
        return null;
    }

    public HoKhau capNhatHoKhau(Long soHoKhau, String diaChi, Long maXaPhuong, String ghiChu) {
        System.out.println("DEBUG: Cập nhật hộ khẩu " + soHoKhau);
        
        // Kiểm tra hộ khẩu có tồn tại không
        if (!hoKhauRepository.existsById(soHoKhau)) {
            throw new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau);
        }
        
        HoKhau hoKhau = hoKhauRepository.findById(soHoKhau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau));
        
        System.out.println("DEBUG: Tìm thấy hộ khẩu: " + hoKhau.getSoHoKhau());
        
        if (diaChi != null && !diaChi.trim().isEmpty()) {
            hoKhau.setDiaChi(diaChi);
        }
        if (ghiChu != null) {
            hoKhau.setGhiChu(ghiChu);
        }
        if (maXaPhuong != null) {
            XaPhuong xaPhuong = xaPhuongRepository.findById(maXaPhuong)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy xã phường: " + maXaPhuong));
            hoKhau.setXaPhuong(xaPhuong);
        }
        
        HoKhau saved = hoKhauRepository.save(hoKhau);
        hoKhauRepository.flush(); // Đảm bảo lưu ngay lập tức
        System.out.println("DEBUG: Cập nhật thành công hộ khẩu " + soHoKhau);
        return saved;
    }

    @Transactional
    public HoKhau taoHoKhau(Long soHoKhau, String diaChi, Long maXaPhuong, String ghiChu, Long maNhanKhauChuHo) {
        System.out.println("DEBUG: Tạo hộ khẩu mới với soHoKhau: " + soHoKhau);
        
        // Xóa toàn bộ cache và tắt auto-flush NGAY LẬP TỨC - TRƯỚC MỌI THỨ
        entityManager.clear();
        Session session = entityManager.unwrap(Session.class);
        jakarta.persistence.FlushModeType originalFlushMode = entityManager.getFlushMode();
        entityManager.setFlushMode(jakarta.persistence.FlushModeType.COMMIT);
        
        // Biến để lưu kết quả
        final boolean[] hoKhauExists = {false};
        final boolean[] xaPhuongExists = {false};
        final RuntimeException[] exception = {null};
        
        try {
            // TẤT CẢ SQL trong doWork - KHÔNG có repository call nào trước đó
            session.doWork(new Work() {
                @Override
                public void execute(Connection connection) throws java.sql.SQLException {
                    try {
                        // Kiểm tra hộ khẩu đã tồn tại chưa
                        try (PreparedStatement checkStmt = connection.prepareStatement("SELECT COUNT(*) FROM HOKHAU WHERE SOHOKHAU = ?")) {
                            checkStmt.setLong(1, soHoKhau);
                            try (java.sql.ResultSet rs = checkStmt.executeQuery()) {
                                if (rs.next() && rs.getLong(1) > 0) {
                                    hoKhauExists[0] = true;
                                    return;
                                }
                            }
                        }
                        
                        // Kiểm tra xã phường tồn tại
                        try (PreparedStatement checkXaPhuong = connection.prepareStatement("SELECT COUNT(*) FROM XAPHUONG WHERE MAXAPHUONG = ?")) {
                            checkXaPhuong.setLong(1, maXaPhuong);
                            try (java.sql.ResultSet rs = checkXaPhuong.executeQuery()) {
                                if (rs.next() && rs.getLong(1) == 0) {
                                    exception[0] = new RuntimeException("Không tìm thấy xã phường: " + maXaPhuong);
                                    return;
                                }
                                xaPhuongExists[0] = true;
                            }
                        }
                        
                        // Bật IDENTITY_INSERT
                        try (Statement stmt1 = connection.createStatement()) {
                            stmt1.execute("SET IDENTITY_INSERT HOKHAU ON");
                            System.out.println("DEBUG: Đã bật IDENTITY_INSERT");
                        }
                        
                        try {
                            // Chèn dữ liệu
                            String diaChiValue = diaChi != null ? diaChi : "";
                            String ghiChuValue = ghiChu != null ? ghiChu : "";
                            String insertSql = "INSERT INTO HOKHAU (SOHOKHAU, DIACHI, MAXAPHUONG, GHICHU, NGAYCAP) VALUES (?, ?, ?, ?, GETDATE())";
                            
                            try (PreparedStatement pstmt = connection.prepareStatement(insertSql)) {
                                pstmt.setLong(1, soHoKhau);
                                pstmt.setString(2, diaChiValue);
                                pstmt.setLong(3, maXaPhuong);
                                pstmt.setString(4, ghiChuValue);
                                int rowsAffected = pstmt.executeUpdate();
                                System.out.println("DEBUG: Đã chèn " + rowsAffected + " dòng vào HOKHAU");
                            }
                        } finally {
                            // Tắt IDENTITY_INSERT
                            try (Statement stmt2 = connection.createStatement()) {
                                stmt2.execute("SET IDENTITY_INSERT HOKHAU OFF");
                                System.out.println("DEBUG: Đã tắt IDENTITY_INSERT");
                            }
                        }
                    } catch (SQLException e) {
                        exception[0] = new RuntimeException("Lỗi SQL: " + e.getMessage(), e);
                    }
                }
            });
            
            // Kiểm tra exception từ doWork
            if (exception[0] != null) {
                throw exception[0];
            }
            
            // Kiểm tra kết quả
            if (hoKhauExists[0]) {
                throw new RuntimeException("Hộ khẩu với số " + soHoKhau + " đã tồn tại");
            }
            
            if (!xaPhuongExists[0]) {
                throw new RuntimeException("Không tìm thấy xã phường: " + maXaPhuong);
            }
            
            // Xóa cache và reload entity - SAU KHI chèn xong
            entityManager.clear();
            
            // Reload entity từ database
            HoKhau hoKhau = hoKhauRepository.findById(soHoKhau)
                    .orElseThrow(() -> new RuntimeException("Không thể tạo hộ khẩu: " + soHoKhau));
            
            // Nếu có mã nhân khẩu chủ hộ, cập nhật quan hệ
            if (maNhanKhauChuHo != null) {
                NhanKhau chuHo = nhanKhauRepository.findById(maNhanKhauChuHo)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + maNhanKhauChuHo));
                
                chuHo.setHoKhau(hoKhau);
                chuHo.setQuanHeVoiChuHo("Chủ hộ");
                nhanKhauRepository.save(chuHo);
                nhanKhauRepository.flush();
            }
            
            System.out.println("DEBUG: Tạo hộ khẩu thành công: " + hoKhau.getSoHoKhau());
            return hoKhau;
            
        } finally {
            // Khôi phục flush mode
            entityManager.setFlushMode(originalFlushMode);
        }
    }

    public void xoaHoKhau(Long soHoKhau) {
        System.out.println("DEBUG: Bắt đầu xóa hộ khẩu " + soHoKhau);
        
        // Kiểm tra hộ khẩu có tồn tại không bằng existsById
        boolean exists = hoKhauRepository.existsById(soHoKhau);
        System.out.println("DEBUG: Hộ khẩu " + soHoKhau + " exists: " + exists);
        
        if (!exists) {
            throw new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau);
        }
        
        // Lấy hộ khẩu
        HoKhau hoKhau = hoKhauRepository.findById(soHoKhau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu: " + soHoKhau));
        
        System.out.println("DEBUG: Tìm thấy hộ khẩu: " + hoKhau.getSoHoKhau() + ", địa chỉ: " + hoKhau.getDiaChi());
        
        // Kiểm tra xem hộ khẩu có nhân khẩu không
        List<NhanKhau> nhanKhauList = nhanKhauRepository.findByHoKhau_SoHoKhau(soHoKhau);
        System.out.println("DEBUG: Số nhân khẩu trong hộ khẩu " + soHoKhau + ": " + (nhanKhauList != null ? nhanKhauList.size() : 0));
        
        if (nhanKhauList != null && !nhanKhauList.isEmpty()) {
            throw new RuntimeException("Không thể xóa hộ khẩu vì còn nhân khẩu. Vui lòng xóa hoặc chuyển nhân khẩu trước.");
        }
        
        // Xóa hộ khẩu
        hoKhauRepository.delete(hoKhau);
        hoKhauRepository.flush(); // Đảm bảo xóa ngay lập tức
        
        // Kiểm tra lại sau khi xóa
        boolean stillExists = hoKhauRepository.existsById(soHoKhau);
        System.out.println("DEBUG: Sau khi xóa, hộ khẩu " + soHoKhau + " vẫn tồn tại: " + stillExists);
        
        if (stillExists) {
            throw new RuntimeException("Xóa hộ khẩu thất bại. Hộ khẩu vẫn tồn tại sau khi xóa.");
        }
        
        System.out.println("DEBUG: Xóa hộ khẩu " + soHoKhau + " thành công");
    }
}

