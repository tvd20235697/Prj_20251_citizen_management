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
@Table(name = "LICHSU_THAYDOI_HOKHAU")
public class LichSuThayDoiHoKhau {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MALICHSUTHAYDOI")
    private Long maLichSuThayDoi;

    @ManyToOne
    @JoinColumn(name = "SOHOKHAU", nullable = false)
    private HoKhau hoKhau;

    @Column(name = "NOIDUNGTHAYDOI", columnDefinition = "TEXT")
    private String noiDungThayDoi; // Ví dụ: "Thay doi chu ho", "Tach ho"

    @Column(name = "NGAYTHAYDOI", nullable = false)
    private LocalDateTime ngayThayDoi;

    @Column(name = "GHICHU", columnDefinition = "TEXT")
    private String ghiChu;
}


