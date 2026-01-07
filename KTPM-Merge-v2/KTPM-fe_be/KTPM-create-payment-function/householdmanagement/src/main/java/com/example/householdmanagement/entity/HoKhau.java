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
@Table(name = "HOKHAU")
public class HoKhau {
    @Id
    @Column(name="SOHOKHAU")
    private Long soHoKhau;

    @Column(name="DIACHI",columnDefinition="TEXT")
    private String diaChi;

    @ManyToOne
    @JoinColumn(name="MAXAPHUONG", nullable=false)
    private XaPhuong xaPhuong;

    @CreationTimestamp
    @Column(name="NGAYCAP")
    private LocalDateTime ngayCap;

    @Column(name="GHICHU",columnDefinition="TEXT")
    private String ghiChu;
}
