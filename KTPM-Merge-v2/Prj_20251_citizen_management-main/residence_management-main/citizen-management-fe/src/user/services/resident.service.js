const API_BASE = "http://localhost:8080/api";

const residentService = {
  async getResidentsByHousehold(soHoKhau) {
    try {
      const response = await fetch(`${API_BASE}/nhankhau/ho-khau/${soHoKhau}`);
      if (!response.ok) {
        throw new Error(`Không tìm thấy nhân khẩu cho hộ khẩu: ${soHoKhau}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error("Error fetching residents:", error);
      throw error;
    }
  },

  async addNewResident(residentData) {
    try {
      const response = await fetch(`${API_BASE}/nhankhau/them-moi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(residentData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Không thể thêm nhân khẩu");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding resident:", error);
      throw error;
    }
  },
};

export default residentService;






