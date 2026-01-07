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
@Table(name = "LICHSU_THAYDOI_NHANKHAU")
public class LichSuThayDoiNhanKhau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MALICHSUTHAYDOI")
    private Long maLichSuThayDoi;

    @ManyToOne
    @JoinColumn(name = "MANHANKHAU", nullable = false)
    private NhanKhau nhanKhau;

    @Column(name = "LOAITHAYDOI", columnDefinition = "VARCHAR(50)")
    private String loaiThayDoi; // "Them moi", "Chuyen di", "Qua doi", "Thay doi thong tin"

    @Column(name = "NOIDUNGTHAYDOI", columnDefinition = "TEXT")
    private String noiDungThayDoi;

    @Column(name = "NGAYTHAYDOI", nullable = false)
    private LocalDateTime ngayThayDoi;

    @Column(name = "GHICHU", columnDefinition = "TEXT")
    private String ghiChu;
}


