package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CANBO")
public class CanBo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MACANBO")
    private Long maCanBo;

    @Column(name="HOTEN",columnDefinition="VARCHAR(100)")
    private String hoTen;

    @Column(name="CHUCVU",columnDefinition="VARCHAR(50)")
    private String chucVu;

    @ManyToOne
    @JoinColumn(name="MAXAPHUONG", nullable=false)
    private XaPhuong xaPhuong;
}
