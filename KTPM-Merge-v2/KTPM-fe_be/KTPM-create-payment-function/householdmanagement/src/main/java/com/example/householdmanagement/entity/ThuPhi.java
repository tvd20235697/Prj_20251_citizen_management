package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "THUPHI")
public class ThuPhi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MATHUPHI")
    private Long maThuPhi;

    @ManyToOne
    @JoinColumn(name="SOHOKHAU", nullable=false)
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private HoKhau hoKhau;

    @ManyToOne
    @JoinColumn(name="MADOTTHU", nullable=false)
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private DotThu dotThu;

    @Column(name="SOTIEN",precision=12, scale=2)
    private BigDecimal soTien;

    @Column(name="NGAYDONG",nullable=false)
    private LocalDateTime ngayDong;

    @Column(name="GHICHU",columnDefinition="TEXT")
    private String ghiChu;
}
