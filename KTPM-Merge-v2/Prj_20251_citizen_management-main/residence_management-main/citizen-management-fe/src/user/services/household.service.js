const API_BASE = "http://localhost:8080/api";

const householdService = {
  async getHouseholdByNumber(soHoKhau) {
    try {
      const response = await fetch(`${API_BASE}/hokhau/${soHoKhau}`);
      if (!response.ok) {
        throw new Error(`Không tìm thấy hộ khẩu: ${soHoKhau}`);
      }
      const data = await response.json();
      return {
        soHoKhau: data.soHoKhau || data.id,
        diaChi: data.diaChi || data.address,
        chuHo: data.chuHo || data.headName,
        soDienThoai: data.soDienThoai || data.phone,
        soNhanKhau: data.soNhanKhau || data.members,
        xa: data.xa || data.ward || data.area,
        ngayDangKy: data.ngayCap || data.registeredAt,
        ghiChu: data.ghiChu || data.note,
        loaiCuTru: data.loaiCuTru || "Thường trú",
      };
    } catch (error) {
      console.error("Error fetching household:", error);
      throw error;
    }
  },
};

export default householdService;






