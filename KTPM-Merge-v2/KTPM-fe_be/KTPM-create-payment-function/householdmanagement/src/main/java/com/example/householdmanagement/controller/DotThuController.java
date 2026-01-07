package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.DotThuDTO;
import com.example.householdmanagement.service.DotThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dot-thu")
@CrossOrigin(origins = "*")
public class DotThuController {
    
    @Autowired
    private DotThuService dotThuService;
    
    // CRUD cơ bản
    @GetMapping
    public ResponseEntity<List<DotThuDTO>> getAllDotThu() {
        List<DotThuDTO> dotThuList = dotThuService.getAllDotThu();
        return ResponseEntity.ok(dotThuList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DotThuDTO> getDotThuById(@PathVariable Long id) {
        Optional<DotThuDTO> dotThu = dotThuService.getDotThuById(id);
        return dotThu.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<DotThuDTO> createDotThu(@Valid @RequestBody DotThuDTO dotThuDTO) {
        try {
            DotThuDTO createdDotThu = dotThuService.createDotThu(dotThuDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDotThu);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DotThuDTO> updateDotThu(@PathVariable Long id, @Valid @RequestBody DotThuDTO dotThuDTO) {
        try {
            DotThuDTO updatedDotThu = dotThuService.updateDotThu(id, dotThuDTO);
            return ResponseEntity.ok(updatedDotThu);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDotThu(@PathVariable Long id) {
        try {
            dotThuService.deleteDotThu(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
