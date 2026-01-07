package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.TotalCollectedDto;
import com.example.householdmanagement.dto.UnpaidHouseholdDto;
import com.example.householdmanagement.dto.SanitationStatsDto;
import com.example.householdmanagement.entity.LoaiPhi;
import com.example.householdmanagement.repository.LoaiPhiRepository;
import com.example.householdmanagement.repository.ThuPhiRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class FeeReportService {
    private final ThuPhiRepository thuPhiRepository;
    private final LoaiPhiRepository loaiPhiRepository;
    private static final String SANITATION_NAME = "Phí vệ sinh"; // adjust if database uses different value

    public FeeReportService(ThuPhiRepository thuPhiRepository, LoaiPhiRepository loaiPhiRepository) {
        this.thuPhiRepository = thuPhiRepository;
        this.loaiPhiRepository = loaiPhiRepository;
    }

    public TotalCollectedDto getTotalCollectedByLoai(Long maLoai) {
        BigDecimal total = thuPhiRepository.totalCollectedByLoai(maLoai);
        if (total == null) total = BigDecimal.ZERO;
        return new TotalCollectedDto(maLoai, total);
    }

    public List<UnpaidHouseholdDto> getUnpaidHouseholdsByLoai(Long maLoai) {
        return thuPhiRepository.findUnpaidHouseholdsByLoai(maLoai);
    }

    public SanitationStatsDto getSanitationStats() {
        Optional<LoaiPhi> loaiOpt = loaiPhiRepository.findAll().stream()
                .filter(lp -> SANITATION_NAME.equalsIgnoreCase(lp.getTenLoaiPhi()))
                .findFirst();
        if (!loaiOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại phí 'Vệ sinh'");
        }
        Long maLoai = loaiOpt.get().getMaLoaiPhi();
        Long peoplePaid = thuPhiRepository.countDistinctPeoplePaidByLoai(maLoai);
        List<UnpaidHouseholdDto> unpaid = thuPhiRepository.findUnpaidHouseholdsByLoai(maLoai);
        long householdsUnpaid = unpaid == null ? 0 : unpaid.size();
        return new SanitationStatsDto(peoplePaid == null ? 0 : peoplePaid, householdsUnpaid);
    }

    public List<UnpaidHouseholdDto> getSanitationUnpaidHouseholds() {
        Optional<LoaiPhi> loaiOpt = loaiPhiRepository.findAll().stream()
                .filter(lp -> SANITATION_NAME.equalsIgnoreCase(lp.getTenLoaiPhi()))
                .findFirst();
        if (!loaiOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy loại phí 'Vệ sinh'");
        }
        Long maLoai = loaiOpt.get().getMaLoaiPhi();
        return thuPhiRepository.findUnpaidHouseholdsByLoai(maLoai);
    }
}

