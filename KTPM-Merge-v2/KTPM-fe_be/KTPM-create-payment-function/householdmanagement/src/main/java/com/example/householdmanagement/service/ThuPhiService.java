package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.ThuPhiDTO;
import com.example.householdmanagement.entity.DotThu;
import com.example.householdmanagement.entity.HoKhau;
import com.example.householdmanagement.entity.ThuPhi;
import com.example.householdmanagement.repository.DotThuRepository;
import com.example.householdmanagement.repository.HoKhauRepository;
import com.example.householdmanagement.repository.ThuPhiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ThuPhiService {

    @Autowired
    private ThuPhiRepository thuPhiRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @Autowired
    private DotThuRepository dotThuRepository;

    // ================= CRUD =================

    public List<ThuPhiDTO> getAllThuPhi() {
        return thuPhiRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ThuPhiDTO> getThuPhiById(Long id) {
        return thuPhiRepository.findById(id)
                .map(this::convertToDTO);
    }

    public ThuPhiDTO createThuPhi(ThuPhiDTO dto) {

        HoKhau hoKhau = hoKhauRepository.findById(dto.getSoHoKhau())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy hộ khẩu ID: " + dto.getSoHoKhau()));

        DotThu dotThu = dotThuRepository.findById(dto.getMaDotThu())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy đợt thu ID: " + dto.getMaDotThu()));

        ThuPhi thuPhi = new ThuPhi();
        thuPhi.setHoKhau(hoKhau);
        thuPhi.setDotThu(dotThu);
        thuPhi.setSoTien(dto.getSoTien());
        thuPhi.setNgayDong(dto.getNgayDong());
        thuPhi.setGhiChu(dto.getGhiChu());

        return convertToDTO(thuPhiRepository.save(thuPhi));
    }

    public ThuPhiDTO updateThuPhi(Long id, ThuPhiDTO dto) {

        ThuPhi thuPhi = thuPhiRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy thu phí ID: " + id));

        if (!thuPhi.getHoKhau().getSoHoKhau().equals(dto.getSoHoKhau())) {
            HoKhau hoKhau = hoKhauRepository.findById(dto.getSoHoKhau())
                    .orElseThrow(() ->
                            new RuntimeException("Không tìm thấy hộ khẩu ID: " + dto.getSoHoKhau()));
            thuPhi.setHoKhau(hoKhau);
        }

        if (!thuPhi.getDotThu().getMaDotThu().equals(dto.getMaDotThu())) {
            DotThu dotThu = dotThuRepository.findById(dto.getMaDotThu())
                    .orElseThrow(() ->
                            new RuntimeException("Không tìm thấy đợt thu ID: " + dto.getMaDotThu()));
            thuPhi.setDotThu(dotThu);
        }

        thuPhi.setSoTien(dto.getSoTien());
        thuPhi.setNgayDong(dto.getNgayDong());
        thuPhi.setGhiChu(dto.getGhiChu());

        return convertToDTO(thuPhiRepository.save(thuPhi));
    }

    public void deleteThuPhi(Long id) {
        thuPhiRepository.deleteById(id);
    }

    // ================= MAPPING =================

    private ThuPhiDTO convertToDTO(ThuPhi thuPhi) {
        ThuPhiDTO dto = new ThuPhiDTO();
        dto.setMaThuPhi(thuPhi.getMaThuPhi());
        
        // Kiểm tra null để tránh NullPointerException
        if (thuPhi.getHoKhau() != null) {
            dto.setSoHoKhau(thuPhi.getHoKhau().getSoHoKhau());
        } else {
            dto.setSoHoKhau(null);
        }
        
        if (thuPhi.getDotThu() != null) {
            dto.setMaDotThu(thuPhi.getDotThu().getMaDotThu());
            dto.setTenDotThu(thuPhi.getDotThu().getTenDotThu());
            
            // Kiểm tra LoaiPhi có thể null
            if (thuPhi.getDotThu().getLoaiPhi() != null) {
                dto.setTenLoaiPhi(thuPhi.getDotThu().getLoaiPhi().getTenLoaiPhi());
            } else {
                dto.setTenLoaiPhi(null);
            }
        } else {
            dto.setMaDotThu(null);
            dto.setTenDotThu(null);
            dto.setTenLoaiPhi(null);
        }
        
        dto.setSoTien(thuPhi.getSoTien());
        dto.setNgayDong(thuPhi.getNgayDong());
        dto.setGhiChu(thuPhi.getGhiChu());

        return dto;
    }
}
