package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LOAIPHI",uniqueConstraints = {
    @UniqueConstraint(columnNames = {"TENLOAIPHI"})
})
public class LoaiPhi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MALOAI")
    private Long maLoaiPhi;

    @Column(name="TENLOAIPHI",columnDefinition="VARCHAR(100)")
    private String tenLoaiPhi;

    @Column(name="MOTA",columnDefinition="TEXT")
    private String moTa;

    @Column(name="BATBUOC",nullable=false)
    private Boolean batBuoc=false;

    @Column(name="DINHMUC",precision=12, scale=2)
    private BigDecimal dinhMuc;

    @Column(name = "MUCTIEU", precision = 15, scale = 2)
    private BigDecimal mucTieu;

}
