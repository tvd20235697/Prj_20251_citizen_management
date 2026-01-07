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
@Table(name = "DOTTHU")
public class DotThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MADOTTHU")
    private Long maDotThu;

    @ManyToOne
    @JoinColumn(name = "MALOAI", nullable = false)
    private LoaiPhi loaiPhi;

    @Column(name="TENDOTTHU",columnDefinition="VARCHAR(100)")
    private String tenDotThu;
    
    @Column(name="NGAYBATDAU",nullable=false)
    private LocalDateTime ngayBatDau;

    @Column(name="NGAYKETTHUC",nullable=false)
    private LocalDateTime ngayKetThuc;
}
