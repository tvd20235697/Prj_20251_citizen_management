import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

export default function AdminResidentEditModal({ resident, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    hoTen: "",
    gioiTinh: "",
    ngaySinh: "",
    cmnd: "",
    ngheNghiep: "",
    quanHeVoiChuHo: "",
    trangThai: "Thuong tru",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (resident && isOpen) {
      setFormData({
        hoTen: resident.hoTen || resident.name || "",
        gioiTinh: resident.gioiTinh || resident.gender || "",
        ngaySinh: resident.ngaySinh 
          ? (resident.ngaySinh.includes("T") 
              ? resident.ngaySinh.split("T")[0] 
              : resident.ngaySinh)
          : (resident.birthDate 
              ? (resident.birthDate.includes("T") 
                  ? resident.birthDate.split("T")[0] 
                  : resident.birthDate)
              : ""),
        cmnd: resident.cmnd || resident.cccd || resident.soCCCD || "",
        ngheNghiep: resident.ngheNghiep || resident.occupation || "",
        quanHeVoiChuHo: resident.quanHeVoiChuHo || "",
        trangThai: resident.trangThai || "Thuong tru",
      });
    }
  }, [resident, isOpen]);

  if (!isOpen || !resident) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const maNhanKhau = resident.maNhanKhau || resident.id;
      if (!maNhanKhau) {
        throw new Error("Không tìm thấy mã nhân khẩu");
      }

      // Format ngaySinh for API - convert to ISO string with time
      const ngaySinhFormatted = formData.ngaySinh 
        ? (formData.ngaySinh.includes("T") 
            ? formData.ngaySinh 
            : `${formData.ngaySinh}T00:00:00`)
        : null;

      // Sử dụng API cap-nhat mới để cập nhật tất cả thông tin
      const updatePayload = {
        maNhanKhau: maNhanKhau,
        hoTen: formData.hoTen,
        gioiTinh: formData.gioiTinh,
        ngaySinh: ngaySinhFormatted,
        cmnd: formData.cmnd || null,
        ngheNghiep: formData.ngheNghiep || null,
        quanHeVoiChuHo: formData.quanHeVoiChuHo,
        trangThai: formData.trangThai,
      };

      const response = await fetch(`${API_BASE}/nhankhau/cap-nhat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Cập nhật thất bại");
      }

      const updatedResident = await response.json();
      console.log("Updated resident:", updatedResident);

      setMessage({ type: "success", text: "Cập nhật thông tin nhân khẩu thành công!" });
      
      if (onUpdate) {
        onUpdate({ success: true });
      }
      
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating resident:", error);
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra khi cập nhật" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-[10000] text-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Pencil className="w-6 h-6 text-blue-400" />
            </div>
            Chỉnh sửa nhân khẩu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Họ tên *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">CCCD</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.cmnd}
                onChange={(e) => setFormData({ ...formData, cmnd: e.target.value })}
                placeholder="Nhập số CCCD"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Ngày sinh *</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.ngaySinh}
                onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Giới tính *</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.gioiTinh}
                onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
              >
                <option value="" className="bg-gray-800">Chọn giới tính</option>
                <option value="Nam" className="bg-gray-800">Nam</option>
                <option value="Nữ" className="bg-gray-800">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Nghề nghiệp</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.ngheNghiep}
                onChange={(e) => setFormData({ ...formData, ngheNghiep: e.target.value })}
                placeholder="Nhập nghề nghiệp"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Quan hệ với chủ hộ *</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.quanHeVoiChuHo}
                onChange={(e) => setFormData({ ...formData, quanHeVoiChuHo: e.target.value })}
              >
                <option value="" className="bg-gray-800">Chọn quan hệ</option>
                <option value="Chủ hộ" className="bg-gray-800">Chủ hộ</option>
                <option value="Con" className="bg-gray-800">Con</option>
                <option value="Vợ" className="bg-gray-800">Vợ</option>
                <option value="Chồng" className="bg-gray-800">Chồng</option>
                <option value="Cha" className="bg-gray-800">Cha</option>
                <option value="Mẹ" className="bg-gray-800">Mẹ</option>
                <option value="Khác" className="bg-gray-800">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Trạng thái *</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                value={formData.trangThai}
                onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
              >
                <option value="Thuong tru" className="bg-gray-800">Thường trú</option>
                <option value="Moi sinh" className="bg-gray-800">Mới sinh</option>
                <option value="Qua doi" className="bg-gray-800">Qua đời</option>
                <option value="Chuyen di" className="bg-gray-800">Chuyển đi</option>
              </select>
            </div>
          </div>
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${
              message.type === "success" 
                ? "bg-green-500/10 text-green-400 border border-green-500/30" 
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {message.text}
            </div>
          )}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/20"
            >
              {submitting ? "Đang cập nhật..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

