package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "XAPHUONG")
public class XaPhuong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MAXAPHUONG")
    private Long maXaPhuong;

    @Column(name="TENXAPHUONG",columnDefinition="VARCHAR(100)")
    private String tenXaPhuong;

    @ManyToOne
    @JoinColumn(name="MAQUANHUYEN", nullable=false)
    private QuanHuyen quanHuyen;
}
