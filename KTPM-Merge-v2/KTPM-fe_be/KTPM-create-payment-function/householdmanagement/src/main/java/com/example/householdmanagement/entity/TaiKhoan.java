package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TAIKHOAN")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MATAIKHOAN")
    private Long maTaiKhoan;

    @ManyToOne
    @JoinColumn(name="MACANBO", nullable=true)
    private CanBo maCanBo;

    @ManyToOne
    @JoinColumn(name="MANHANKHAU", nullable=true)
    private NhanKhau maNhanKhau;

    @Column(name="TENDANGNHAP",columnDefinition="VARCHAR(50)", unique=true)
    private String tenDangNhap;

    @Column(name="MATKHAU",columnDefinition="VARCHAR(100)")
    private String matKhau;

    @Column(name="VAITRO",columnDefinition="VARCHAR(50)")
    private String vaiTro;

    @Column(name="EMAIL", columnDefinition="VARCHAR(100)", unique=true)
    private String email;

    // Store trangThai as string; columnDefinition declares the ENUM in DB schema
    @Column(name="TRANGTHAI", columnDefinition="ENUM('DANG_HOAT_DONG','NGUNG_HOAT_DONG','CHO_KICH_HOAT')")
    private String trangThai = "CHO_KICH_HOAT";
}
