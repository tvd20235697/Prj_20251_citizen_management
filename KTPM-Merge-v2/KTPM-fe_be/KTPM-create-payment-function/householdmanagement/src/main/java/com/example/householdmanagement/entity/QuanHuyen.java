package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "QUANHUYEN")
public class QuanHuyen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MAQUANHUYEN")
    private Long maQuanHuyen;

    @Column(name="TENQUANHUYEN",columnDefinition="VARCHAR(100)")
    private String tenQuanHuyen;

    @ManyToOne
    @JoinColumn(name="MATHANHPHO", nullable=false)
    private ThanhPho thanhPho;
}
