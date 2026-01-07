package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.TaiKhoanRequest;
import com.example.householdmanagement.dto.TaiKhoanResponse;
import com.example.householdmanagement.entity.CanBo;
import com.example.householdmanagement.entity.NhanKhau;
import com.example.householdmanagement.entity.TaiKhoan;
import com.example.householdmanagement.repository.CanBoRepository;
import com.example.householdmanagement.repository.HoKhauRepository;
import com.example.householdmanagement.repository.NhanKhauRepository;
import com.example.householdmanagement.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaiKhoanService {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private CanBoRepository canBoRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    public List<TaiKhoanResponse> layTatCaTaiKhoan() {
        return taiKhoanRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaiKhoanResponse layTaiKhoanTheoId(Long id) {
        TaiKhoan tk = taiKhoanRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + id));
        return toResponse(tk);
    }

    @Transactional
    public TaiKhoanResponse taoTaiKhoan(TaiKhoanRequest req) {
        if (req.getTenDangNhap() == null || req.getTenDangNhap().trim().isEmpty()) {
            throw new RuntimeException("tenDangNhap là bắt buộc");
        }
        if (taiKhoanRepository.existsByTenDangNhap(req.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        if (req.getEmail() != null && taiKhoanRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Kiểm tra phải có maCanBo hoặc maNhanKhau
        if (req.getMaCanBo() == null && req.getMaNhanKhau() == null) {
            throw new RuntimeException("Phải có mã cán bộ hoặc mã nhân khẩu");
        }

        TaiKhoan tk = new TaiKhoan();
        
        if (req.getMaCanBo() != null) {
            CanBo canBo = canBoRepository.findById(req.getMaCanBo())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cán bộ: " + req.getMaCanBo()));
            tk.setMaCanBo(canBo);
        }
        
        if (req.getMaNhanKhau() != null) {
            NhanKhau nhanKhau = nhanKhauRepository.findById(req.getMaNhanKhau())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + req.getMaNhanKhau()));
            tk.setMaNhanKhau(nhanKhau);
        }
        
        tk.setTenDangNhap(req.getTenDangNhap());
        tk.setMatKhau(req.getMatKhau()); // NOTE: mật khẩu hiện lưu thô, nên băm khi production
        tk.setVaiTro(req.getVaiTro());
        tk.setEmail(req.getEmail());
        if (req.getTrangThai() != null) {
            tk.setTrangThai(req.getTrangThai());
        } else {
            tk.setTrangThai("DANG_HOAT_DONG"); // Default nếu không có
        }

        try {
            System.out.println("=== BẮT ĐẦU TẠO TÀI KHOẢN ===");
            System.out.println("TenDangNhap: " + tk.getTenDangNhap());
            System.out.println("Email: " + tk.getEmail());
            System.out.println("VaiTro: " + tk.getVaiTro());
            System.out.println("MaNhanKhau: " + (tk.getMaNhanKhau() != null ? tk.getMaNhanKhau().getMaNhanKhau() : "null"));
            System.out.println("MaCanBo: " + (tk.getMaCanBo() != null ? tk.getMaCanBo().getMaCanBo() : "null"));
            
            TaiKhoan saved = taiKhoanRepository.save(tk);
            System.out.println("Saved account with maTaiKhoan: " + saved.getMaTaiKhoan());
            
            // Flush để đảm bảo dữ liệu được lưu ngay vào database
            taiKhoanRepository.flush();
            System.out.println("Flushed to database");
            
            // Verify saved - kiểm tra xem có được lưu thành công không
            if (saved.getMaTaiKhoan() == null) {
                System.err.println("ERROR: maTaiKhoan is null after save!");
                throw new RuntimeException("Lỗi: Tài khoản không được lưu vào database (maTaiKhoan = null)");
            }
            
            // Double check: query lại từ database
            TaiKhoan verify = taiKhoanRepository.findById(saved.getMaTaiKhoan())
                    .orElseThrow(() -> {
                        System.err.println("ERROR: Cannot find account after save! maTaiKhoan: " + saved.getMaTaiKhoan());
                        return new RuntimeException("Lỗi: Không thể tìm thấy tài khoản vừa tạo trong database");
                    });
            
            System.out.println("Verified account exists in database: " + verify.getMaTaiKhoan());
            System.out.println("=== HOÀN TẤT TẠO TÀI KHOẢN ===");
            
            return toResponse(verify);
        } catch (RuntimeException e) {
            System.err.println("RuntimeException khi tạo tài khoản: " + e.getMessage());
            e.printStackTrace();
            // Re-throw RuntimeException để giữ nguyên message
            throw e;
        } catch (Exception e) {
            System.err.println("Exception khi tạo tài khoản: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi lưu tài khoản vào database: " + e.getMessage(), e);
        }
    }

    @Transactional
    public TaiKhoanResponse capNhatTaiKhoan(Long id, TaiKhoanRequest req) {
        TaiKhoan tk = taiKhoanRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + id));

        if (req.getMaCanBo() != null) {
            CanBo canBo = canBoRepository.findById(req.getMaCanBo())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cán bộ: " + req.getMaCanBo()));
            tk.setMaCanBo(canBo);
        }
        if (req.getMaNhanKhau() != null) {
            NhanKhau nhanKhau = nhanKhauRepository.findById(req.getMaNhanKhau())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu: " + req.getMaNhanKhau()));
            tk.setMaNhanKhau(nhanKhau);
        }
        if (req.getTenDangNhap() != null && !req.getTenDangNhap().trim().isEmpty()) {
            if (!req.getTenDangNhap().equals(tk.getTenDangNhap()) && taiKhoanRepository.existsByTenDangNhap(req.getTenDangNhap())) {
                throw new RuntimeException("Tên đăng nhập đã tồn tại");
            }
            tk.setTenDangNhap(req.getTenDangNhap());
        }
        if (req.getMatKhau() != null) tk.setMatKhau(req.getMatKhau());
        if (req.getVaiTro() != null) tk.setVaiTro(req.getVaiTro());
        if (req.getEmail() != null) {
            if (!req.getEmail().equals(tk.getEmail()) && taiKhoanRepository.existsByEmail(req.getEmail())) {
                throw new RuntimeException("Email đã tồn tại");
            }
            tk.setEmail(req.getEmail());
        }
        if (req.getTrangThai() != null) tk.setTrangThai(req.getTrangThai());

        TaiKhoan saved = taiKhoanRepository.save(tk);
        return toResponse(saved);
    }

    @Transactional
    public void xoaTaiKhoan(Long id) {
        TaiKhoan tk = taiKhoanRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + id));
        taiKhoanRepository.delete(tk);
    }

    // Thay đổi mật khẩu
    @Transactional
    public void thayDoiMatKhau(Long maTaiKhoan, String matKhauHienTai, String matKhauMoi) {
        TaiKhoan tk = taiKhoanRepository.findById(maTaiKhoan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + maTaiKhoan));
        
        // Kiểm tra mật khẩu hiện tại
        if (tk.getMatKhau() == null || !tk.getMatKhau().equals(matKhauHienTai)) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }
        
        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (matKhauHienTai.equals(matKhauMoi)) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu hiện tại");
        }
        
        // Cập nhật mật khẩu mới
        tk.setMatKhau(matKhauMoi);
        taiKhoanRepository.save(tk);
    }

    public TaiKhoanResponse toResponse(TaiKhoan tk) {
        TaiKhoanResponse r = new TaiKhoanResponse();
        r.setMaTaiKhoan(tk.getMaTaiKhoan());
        r.setMaCanBo(tk.getMaCanBo() != null ? tk.getMaCanBo().getMaCanBo() : null);
        r.setMaNhanKhau(tk.getMaNhanKhau() != null ? tk.getMaNhanKhau().getMaNhanKhau() : null);
        r.setTenDangNhap(tk.getTenDangNhap());
        r.setVaiTro(tk.getVaiTro());
        r.setEmail(tk.getEmail());
        r.setTrangThai(tk.getTrangThai());
        
        // Lấy tên từ CanBo hoặc NhanKhau
        if (tk.getMaCanBo() != null) {
            r.setHoTen(tk.getMaCanBo().getHoTen());
        } else if (tk.getMaNhanKhau() != null) {
            r.setHoTen(tk.getMaNhanKhau().getHoTen());
            if (tk.getMaNhanKhau().getHoKhau() != null) {
                r.setSoHoKhau(tk.getMaNhanKhau().getHoKhau().getSoHoKhau());
            }
        }
        
        return r;
    }
    
    // Tìm tài khoản theo tên đăng nhập hoặc email
    public TaiKhoanResponse timTaiKhoanDangNhap(String tenDangNhapHoacEmail, String matKhau) {
        // Trim và normalize input
        String input = tenDangNhapHoacEmail != null ? tenDangNhapHoacEmail.trim() : null;
        if (input == null || input.isEmpty()) {
            throw new RuntimeException("Tên đăng nhập/email không được để trống");
        }
        
        // Tìm theo tên đăng nhập trước
        TaiKhoan tk = taiKhoanRepository.findByTenDangNhap(input)
                .orElse(null);
        
        // Nếu không tìm thấy, tìm theo email
        if (tk == null) {
            tk = taiKhoanRepository.findByEmail(input)
                    .orElse(null);
        }
        
        if (tk == null) {
            // Debug: List tất cả tài khoản để kiểm tra
            List<TaiKhoan> allAccounts = taiKhoanRepository.findAll();
            String allUsernames = allAccounts.stream()
                    .map(TaiKhoan::getTenDangNhap)
                    .filter(u -> u != null)
                    .collect(java.util.stream.Collectors.joining(", "));
            throw new RuntimeException("Không tìm thấy tài khoản với tên đăng nhập/email: '" + input + "'. Các tài khoản hiện có: " + allUsernames);
        }
        
        if (tk.getMatKhau() == null || !tk.getMatKhau().equals(matKhau)) {
            throw new RuntimeException("Mật khẩu không đúng");
        }
        
        if (tk.getTrangThai() == null || !"DANG_HOAT_DONG".equals(tk.getTrangThai())) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt hoặc đã bị khóa. Trạng thái hiện tại: " + tk.getTrangThai());
        }
        
        try {
            return toResponse(tk);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xử lý thông tin tài khoản: " + e.getMessage(), e);
        }
    }

    // Lấy tài khoản theo số hộ khẩu (tìm chủ hộ của hộ khẩu đó)
    public TaiKhoanResponse layTaiKhoanTheoSoHoKhau(Long soHoKhau) {
        // Lấy danh sách nhân khẩu của hộ khẩu
        List<NhanKhau> nhanKhauList = nhanKhauRepository.findByHoKhau_SoHoKhau(soHoKhau);
        
        // Tìm chủ hộ (quanHeVoiChuHo = "Chủ hộ")
        NhanKhau chuHo = nhanKhauList.stream()
                .filter(nk -> "Chủ hộ".equals(nk.getQuanHeVoiChuHo()))
                .findFirst()
                .orElse(null);
        
        if (chuHo == null) {
            return null; // Không có chủ hộ
        }
        
        // Tìm tài khoản của chủ hộ
        TaiKhoan taiKhoan = taiKhoanRepository.findAll().stream()
                .filter(tk -> tk.getMaNhanKhau() != null && tk.getMaNhanKhau().getMaNhanKhau().equals(chuHo.getMaNhanKhau()))
                .findFirst()
                .orElse(null);
        
        if (taiKhoan == null) {
            return null; // Chủ hộ chưa có tài khoản
        }
        
        return toResponse(taiKhoan);
    }
}

