package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.DotThuDTO;
import com.example.householdmanagement.entity.DotThu;
import com.example.householdmanagement.entity.LoaiPhi;
import com.example.householdmanagement.repository.DotThuRepository;
import com.example.householdmanagement.repository.LoaiPhiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DotThuService {

    @Autowired
    private DotThuRepository dotThuRepository;

    @Autowired
    private LoaiPhiRepository loaiPhiRepository;

    // ================== GET ALL ==================
    public List<DotThuDTO> getAllDotThu() {
        return dotThuRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ================== GET BY ID ==================
    public Optional<DotThuDTO> getDotThuById(Long id) {
        return dotThuRepository.findById(id)
                .map(this::toDTO);
    }

    // ================== CREATE ==================
    public DotThuDTO createDotThu(DotThuDTO dto) {

        LoaiPhi loaiPhi = loaiPhiRepository.findById(dto.getMaLoai())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy loại phí ID = " + dto.getMaLoai())
                );

        DotThu dotThu = new DotThu();
        dotThu.setTenDotThu(dto.getTenDotThu());
        dotThu.setNgayBatDau(dto.getNgayBatDau());
        dotThu.setNgayKetThuc(dto.getNgayKetThuc());
        dotThu.setLoaiPhi(loaiPhi); //  QUAN TRỌNG


        return toDTO(dotThuRepository.save(dotThu));
    }

    // ================== UPDATE ==================
    public DotThuDTO updateDotThu(Long id, DotThuDTO dto) {

        DotThu dotThu = dotThuRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy đợt thu ID = " + id)
                );

        LoaiPhi loaiPhi = loaiPhiRepository.findById(dto.getMaLoai())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy loại phí ID = " + dto.getMaLoai())
                );

        dotThu.setTenDotThu(dto.getTenDotThu());
        dotThu.setNgayBatDau(dto.getNgayBatDau());
        dotThu.setNgayKetThuc(dto.getNgayKetThuc());
        dotThu.setLoaiPhi(loaiPhi);

        return toDTO(dotThuRepository.save(dotThu));
    }

    // ================== DELETE ==================
    public void deleteDotThu(Long id) {
        dotThuRepository.deleteById(id);
    }

    // ================== MAPPER ==================
    private DotThuDTO toDTO(DotThu dotThu) {
        DotThuDTO dto = new DotThuDTO();
        dto.setMaDotThu(dotThu.getMaDotThu());
        dto.setTenDotThu(dotThu.getTenDotThu());
        dto.setNgayBatDau(dotThu.getNgayBatDau());
        dto.setNgayKetThuc(dotThu.getNgayKetThuc());
        // Kiểm tra null để tránh NullPointerException
        if (dotThu.getLoaiPhi() != null) {
            dto.setMaLoai(dotThu.getLoaiPhi().getMaLoaiPhi());
        } else {
            dto.setMaLoai(null);
        }
        return dto;
    }
}
