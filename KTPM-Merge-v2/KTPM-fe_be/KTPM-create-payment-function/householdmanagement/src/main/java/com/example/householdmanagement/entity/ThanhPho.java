package com.example.householdmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "THANHPHO")
public class ThanhPho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MATHANHPHO")
    private Long maThanhPho;

    @Column(name="TENTHANHPHO",columnDefinition="VARCHAR(100)")
    private String tenThanhPho;
}
