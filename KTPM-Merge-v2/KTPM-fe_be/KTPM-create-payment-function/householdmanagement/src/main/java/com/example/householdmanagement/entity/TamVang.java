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
@Table(name = "TAMVANG")
public class TamVang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MaTamVang")
    private Long maTamVang;

    @ManyToOne
    @JoinColumn(name="MANHANKHAU", nullable=false)
    private NhanKhau nhanKhau;

    @Column(name="NoiDi",columnDefinition="VARCHAR(100)")
    private String noiDi;
    
    @Column(name="TuNgay",nullable=false)
    private LocalDateTime tuNgay;

    @Column(name="DenNgay")
    private LocalDateTime denNgay;

    @Column(name="LyDo",columnDefinition="TEXT")
    private String lyDo;

    @Column(name="TrangThai",columnDefinition="VARCHAR(50)")
    private String trangThai="Dang tam vang";

    @Column(name="GhiChu",columnDefinition="TEXT")
    private String ghiChu;
}
