package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "NHANKHAU")
public class NhanKhau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MANHANKHAU")
    private Long maNhanKhau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="SOHOKHAU", nullable=false)
    private HoKhau hoKhau;

    @Column(name="HOTEN",columnDefinition="VARCHAR(100)")
    private String hoTen;

    @Column(name="GIOITINH",columnDefinition="VARCHAR(10)")
    private String gioiTinh;

    @Column(name="NGAYSINH")
    private LocalDateTime ngaySinh;

    @Column(name="NGHENGHIEP",columnDefinition="VARCHAR(100)")
    private String ngheNghiep;

    @Column(name="QUANHEVOICHUHO",columnDefinition="VARCHAR(50)")
    private String quanHeVoiChuHo;

    @Column(name="TRANGTHAI",columnDefinition="VARCHAR(50)")
    private String trangThai="Thuong tru";

    @Column(name="CMND",columnDefinition="VARCHAR(20)")
    private String cmnd;

    @Column(name="NOITHUONGTRUCHUYENDEN",columnDefinition="VARCHAR(200)")
    private String noiThuongTruChuyenDen;

    @Column(name="NGAYCHUYENDI")
    private LocalDateTime ngayChuyenDi;

    @Column(name="NOICHUYEN",columnDefinition="VARCHAR(200)")
    private String noiChuyen;

    @Column(name="GHICHU",columnDefinition="TEXT")
    private String ghiChu;
}
