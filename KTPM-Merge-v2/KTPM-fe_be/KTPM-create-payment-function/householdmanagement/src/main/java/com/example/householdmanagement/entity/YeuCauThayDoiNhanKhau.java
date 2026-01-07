package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "YEUCU_THAYDOI_NHANKHAU")
public class YeuCauThayDoiNhanKhau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MAYEUCAU")
    private Long maYeuCau;

    @ManyToOne
    @JoinColumn(name = "MATAIKHOAN", nullable = false)
    private TaiKhoan taiKhoan; // Tài khoản chủ hộ gửi yêu cầu

    @Column(name = "LOAIYEUCU", nullable = false)
    private String loaiYeuCau; // "THEM", "SUA", "XOA"

    @Column(name = "MANHANKHAU")
    private Long maNhanKhau; // Mã nhân khẩu (null nếu là thêm mới, có giá trị nếu sửa/xóa)

    @Column(name = "DULIEU", columnDefinition = "TEXT")
    private String duLieu; // JSON string chứa dữ liệu nhân khẩu

    @Column(name = "TRANGTHAI", nullable = false)
    private String trangThai; // "CHO_XAC_THUC", "DA_XAC_THUC", "TU_CHOI"

    @Column(name = "GHICHU", columnDefinition = "TEXT")
    private String ghiChu; // Ghi chú từ chủ hộ

    @Column(name = "LYDOTUCHOI", columnDefinition = "TEXT")
    private String lyDoTuChoi; // Lý do từ chối (nếu có)

    @ManyToOne
    @JoinColumn(name = "MACANBO_XACTHUC")
    private CanBo canBoXacThuc; // Cán bộ xác thực

    @Column(name = "NGAYXACTHUC")
    private LocalDateTime ngayXacThuc;

    @CreationTimestamp
    @Column(name = "NGAYTAO")
    private LocalDateTime ngayTao;
}

