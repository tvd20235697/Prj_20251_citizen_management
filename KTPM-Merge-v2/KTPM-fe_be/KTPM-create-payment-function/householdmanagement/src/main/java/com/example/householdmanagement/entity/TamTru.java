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
@Table(name = "TAMTRU")
public class TamTru {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MaTamTru")
    private Long maTamTru;

    @ManyToOne
    @JoinColumn(name="MANHANKHAU", nullable=false)
    private NhanKhau nhanKhau;

    @Column(name="NoiTamTru",columnDefinition="VARCHAR(100)")
    private String noiTamTru;
    
    @Column(name="TuNgay",nullable=false)
    private LocalDateTime tuNgay;

    @Column(name="DenNgay",nullable=false)
    private LocalDateTime denNgay;

    @Column(name="LyDo",columnDefinition="TEXT")
    private String lyDo;

    @Column(name="TrangThai",columnDefinition="VARCHAR(50)")
    private String trangThai="Dang tam tru";

    @Column(name="GhiChu",columnDefinition="TEXT")
    private String ghiChu;
}
