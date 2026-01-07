package com.example.householdmanagement.dto;

public class PhiVeSinhStatisticDTO {

    private Long tongHo;
    private Long hoDaDong;
    private Long hoChuaDong;

    public PhiVeSinhStatisticDTO(Long tongHo, Long hoDaDong, Long hoChuaDong) {
        this.tongHo = tongHo;
        this.hoDaDong = hoDaDong;
        this.hoChuaDong = hoChuaDong;
    }

    public Long getTongHo() {
        return tongHo;
    }

    public Long getHoDaDong() {
        return hoDaDong;
    }

    public Long getHoChuaDong() {
        return hoChuaDong;
    }
}
