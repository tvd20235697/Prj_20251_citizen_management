package com.example.householdmanagement.controller;

import com.example.householdmanagement.dto.ThuPhiDTO;
import com.example.householdmanagement.service.ThuPhiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/thu-phi")
@CrossOrigin(origins = "*")
public class ThuPhiController {
    
    private static final Logger logger = LoggerFactory.getLogger(ThuPhiController.class);
    
    @Autowired
    private ThuPhiService thuPhiService;
    
    // CRUD cơ bản
    @GetMapping
    public ResponseEntity<List<ThuPhiDTO>> getAllThuPhi() {
        List<ThuPhiDTO> thuPhiList = thuPhiService.getAllThuPhi();
        return ResponseEntity.ok(thuPhiList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ThuPhiDTO> getThuPhiById(@PathVariable Long id) {
        Optional<ThuPhiDTO> thuPhi = thuPhiService.getThuPhiById(id);
        return thuPhi.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createThuPhi(@Valid @RequestBody ThuPhiDTO thuPhiDTO) {
        try {
            logger.info("Creating ThuPhi with DTO: {}", thuPhiDTO);
            ThuPhiDTO createdThuPhi = thuPhiService.createThuPhi(thuPhiDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdThuPhi);
        } catch (Exception e) {
            logger.error("Error creating ThuPhi: ", e);
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateThuPhi(@PathVariable Long id, @Valid @RequestBody ThuPhiDTO thuPhiDTO) {
        try {
            logger.info("Updating ThuPhi with ID: {}", id);
            ThuPhiDTO updatedThuPhi = thuPhiService.updateThuPhi(id, thuPhiDTO);
            return ResponseEntity.ok(updatedThuPhi);
        } catch (Exception e) {
            logger.error("Error updating ThuPhi: ", e);
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThuPhi(@PathVariable Long id) {
        try {
            thuPhiService.deleteThuPhi(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
