package com.example.householdmanagement.dto;

public class ChuHoSearchDTO {
    private Long maNhanKhau;
    private String hoTen;
    private String cmnd;
    private Long soHoKhau;
    private String diaChi;

    public ChuHoSearchDTO() {}

    public ChuHoSearchDTO(Long maNhanKhau, String hoTen, String cmnd, Long soHoKhau, String diaChi) {
        this.maNhanKhau = maNhanKhau;
        this.hoTen = hoTen;
        this.cmnd = cmnd;
        this.soHoKhau = soHoKhau;
        this.diaChi = diaChi;
    }

    public Long getMaNhanKhau() { return maNhanKhau; }
    public void setMaNhanKhau(Long maNhanKhau) { this.maNhanKhau = maNhanKhau; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getCmnd() { return cmnd; }
    public void setCmnd(String cmnd) { this.cmnd = cmnd; }

    public Long getSoHoKhau() { return soHoKhau; }
    public void setSoHoKhau(Long soHoKhau) { this.soHoKhau = soHoKhau; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
}
