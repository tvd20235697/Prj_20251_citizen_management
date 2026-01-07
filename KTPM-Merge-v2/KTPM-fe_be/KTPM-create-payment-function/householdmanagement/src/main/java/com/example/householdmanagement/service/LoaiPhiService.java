package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.LoaiPhiDTO;
import com.example.householdmanagement.entity.LoaiPhi;
import com.example.householdmanagement.repository.LoaiPhiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoaiPhiService {
    
    @Autowired
    private LoaiPhiRepository loaiPhiRepository;
    
    // CRUD cơ bản
    public List<LoaiPhiDTO> getAllLoaiPhi() {
        return loaiPhiRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<LoaiPhiDTO> getLoaiPhiById(Long id) {
        return loaiPhiRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public LoaiPhiDTO createLoaiPhi(LoaiPhiDTO loaiPhiDTO) {
        LoaiPhi loaiPhi = convertToEntity(loaiPhiDTO);
        if (loaiPhi.getBatBuoc() == null) {
            loaiPhi.setBatBuoc(false);
        }
        LoaiPhi savedLoaiPhi = loaiPhiRepository.save(loaiPhi);
        return convertToDTO(savedLoaiPhi);
    }
    
    public LoaiPhiDTO updateLoaiPhi(Long id, LoaiPhiDTO loaiPhiDTO) {
        LoaiPhi existingLoaiPhi = loaiPhiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phí với ID: " + id));
        
        existingLoaiPhi.setTenLoaiPhi(loaiPhiDTO.getTenLoaiPhi());
        existingLoaiPhi.setMoTa(loaiPhiDTO.getMoTa());
        existingLoaiPhi.setBatBuoc(loaiPhiDTO.getBatBuoc());
        existingLoaiPhi.setDinhMuc(loaiPhiDTO.getDinhMuc());
        
        LoaiPhi updatedLoaiPhi = loaiPhiRepository.save(existingLoaiPhi);
        return convertToDTO(updatedLoaiPhi);
    }
    
    public void deleteLoaiPhi(Long id) {
        loaiPhiRepository.deleteById(id);
    }
    
    private LoaiPhiDTO convertToDTO(LoaiPhi loaiPhi) {
        LoaiPhiDTO dto = new LoaiPhiDTO();
        dto.setMaLoaiPhi(loaiPhi.getMaLoaiPhi());
        dto.setTenLoaiPhi(loaiPhi.getTenLoaiPhi());
        dto.setMoTa(loaiPhi.getMoTa());
        dto.setBatBuoc(loaiPhi.getBatBuoc());
        dto.setDinhMuc(loaiPhi.getDinhMuc());
        dto.setMucTieu(loaiPhi.getMucTieu());
        return dto;
    }
    
    private LoaiPhi convertToEntity(LoaiPhiDTO dto) {
        LoaiPhi loaiPhi = new LoaiPhi();
        loaiPhi.setMaLoaiPhi(dto.getMaLoaiPhi());
        loaiPhi.setTenLoaiPhi(dto.getTenLoaiPhi());
        loaiPhi.setMoTa(dto.getMoTa());
        loaiPhi.setBatBuoc(dto.getBatBuoc());
        loaiPhi.setDinhMuc(dto.getDinhMuc());
        dto.setMucTieu(loaiPhi.getMucTieu());
        return loaiPhi;
    }
}
