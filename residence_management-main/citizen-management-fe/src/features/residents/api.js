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
  return (data || []).map((item) => ({
    id: item.maNhanKhau ?? item.id ?? "",
    name: item.hoTen ?? "",
    gender: item.gioiTinh ?? "",
    birthDate: item.ngaySinh ?? "",
    residenceType: normalizeResidenceType(item.trangThai),
    household: item.soHoKhau ?? "",
    occupation: item.ngheNghiep ?? "",
    cccd: item.cmnd ?? item.cccd ?? "",
    issueDate: item.ngayCap ?? item.issueDate ?? "",
    issuePlace: item.noiCap ?? item.issuePlace ?? "",
    workplace: item.noiLamViec ?? item.workplace ?? "",
    phone: item.soDienThoai ?? item.phone ?? "",
  }));
};

export const submitResidentChangeApi = async (payload) => {
  const res = await fetch(`${API_BASE}/thay-doi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
};

