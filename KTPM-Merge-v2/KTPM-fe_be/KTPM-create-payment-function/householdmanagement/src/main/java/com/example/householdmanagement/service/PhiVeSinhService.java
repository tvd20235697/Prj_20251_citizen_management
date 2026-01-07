package com.example.householdmanagement.service;

import com.example.householdmanagement.dto.PhiVeSinhHouseholdDTO;
import com.example.householdmanagement.repository.PhiVeSinhRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PhiVeSinhService {

    private final PhiVeSinhRepository repository;

    public PhiVeSinhService(PhiVeSinhRepository repository) {
        this.repository = repository;
    }

    public List<PhiVeSinhHouseholdDTO> getHouseholdsDaDong(int nam) {
        return repository.findHouseholdsDaDong(nam);
    }

    public List<PhiVeSinhHouseholdDTO> getHouseholdsChuaDong(int nam) {
        return repository.findHouseholdsChuaDong(nam);
    }

    public Map<String, Object> thongKePhiVeSinh(int nam) {
        long tongSoHo = repository.countTotalHouseholds();
        long daDong = repository.countDaDong(nam);

        Map<String, Object> result = new HashMap<>();
        result.put("nam", nam);
        result.put("tongSoHo", tongSoHo);
        result.put("soHoDaDong", daDong);
        result.put("soHoChuaDong", tongSoHo - daDong);

        return result;
    }
}
