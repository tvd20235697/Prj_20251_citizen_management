const API_BASE = "http://localhost:8080/api/nhankhau";

const normalizeResidenceType = (status) => {
  const value = status?.toLowerCase() || "";
  if (value.includes("tam")) return "tam-tru";
  if (value.includes("kinh")) return "kinh-doanh";
  return "thuong-tru";
};

export const fetchResidentsApi = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
  const data = await res.json();
  return (data || []).map((item) => {
    // Đảm bảo maNhanKhau luôn là số, không phải empty string
    const maNhanKhau = item.maNhanKhau || item.id;
    if (!maNhanKhau) {
      console.warn("Nhân khẩu không có mã:", item);
    }
    return {
      id: maNhanKhau,
      maNhanKhau: maNhanKhau,
      name: item.hoTen ?? "",
      hoTen: item.hoTen ?? "",
      gender: item.gioiTinh ?? "",
      gioiTinh: item.gioiTinh ?? "",
      birthDate: item.ngaySinh ?? "",
      ngaySinh: item.ngaySinh ?? "",
      residenceType: normalizeResidenceType(item.trangThai),
      trangThai: item.trangThai ?? "Thuong tru",
      household: item.soHoKhau ?? "",
      soHoKhau: item.soHoKhau ?? "",
      occupation: item.ngheNghiep ?? "",
      ngheNghiep: item.ngheNghiep ?? "",
      cccd: item.cmnd ?? item.cccd ?? "",
      cmnd: item.cmnd ?? item.cccd ?? "",
      quanHeVoiChuHo: item.quanHeVoiChuHo ?? "",
      issueDate: item.ngayCap ?? item.issueDate ?? "",
      issuePlace: item.noiCap ?? item.issuePlace ?? "",
      workplace: item.noiLamViec ?? item.workplace ?? "",
      phone: item.soDienThoai ?? item.phone ?? "",
    };
  }).filter(item => item.maNhanKhau != null); // Lọc bỏ các item không có mã
};

export const submitResidentChangeApi = async (payload) => {
  const res = await fetch(`${API_BASE}/thay-doi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
};

export const deleteResidentApi = async (maNhanKhau) => {
  const res = await fetch(`${API_BASE}/${maNhanKhau}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    mode: "cors",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API lỗi: ${res.status}`);
  }
  return res;
};

